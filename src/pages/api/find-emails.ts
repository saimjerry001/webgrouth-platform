import type { APIRoute } from 'astro';

export const prerender = false;

const MAX_DOMAINS = 20;
const FETCH_TIMEOUT_MS = 6000;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PLACEHOLDER_PATTERNS = /example\.com|domain\.com|yoursite|sentry\.io|wixpress\.com|godaddy\.com|schema\.org|w3\.org|\.png$|\.jpg$|\.gif$|\.svg$/i;

function normalizeDomain(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
}

async function findEmailsForDomain(origin: string): Promise<{ domain: string; emails: string[]; status: 'ok' | 'error'; error?: string }> {
  const domain = new URL(origin).hostname.replace(/^www\./, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(origin, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebGrouthEmailFinder/1.0; +https://www.webgrouth.com/tools/bulk-email-finder)' },
    });
    if (!res.ok) {
      return { domain, emails: [], status: 'error', error: `Site returned status ${res.status}` };
    }
    const html = await res.text();
    const matches = html.match(EMAIL_RE) ?? [];
    const unique = Array.from(new Set(matches.map((m) => m.toLowerCase())))
      .filter((email) => !PLACEHOLDER_PATTERNS.test(email));
    return { domain, emails: unique, status: 'ok' };
  } catch (err) {
    const message = err instanceof Error && err.name === 'AbortError' ? 'Timed out' : 'Could not reach the site';
    return { domain, emails: [], status: 'error', error: message };
  } finally {
    clearTimeout(timeout);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const domainsInput = (body as { domains?: unknown })?.domains;
  if (!Array.isArray(domainsInput) || domainsInput.length === 0) {
    return new Response(JSON.stringify({ error: 'Provide a non-empty "domains" array' }), { status: 400 });
  }

  const normalized = domainsInput
    .filter((d): d is string => typeof d === 'string')
    .map(normalizeDomain)
    .filter((d): d is string => d !== null);

  const deduped = Array.from(new Set(normalized)).slice(0, MAX_DOMAINS);

  if (deduped.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid domains found in the request' }), { status: 400 });
  }

  const results = await Promise.all(deduped.map(findEmailsForDomain));

  return new Response(JSON.stringify({ results, limit: MAX_DOMAINS, truncated: normalized.length > MAX_DOMAINS }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
