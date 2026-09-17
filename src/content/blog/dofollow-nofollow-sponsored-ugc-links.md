---
title: "Dofollow, Nofollow, Sponsored and UGC Links Explained"
seoTitle: "Dofollow, Nofollow, Sponsored and UGC Links Explained"
description: "Understand dofollow, nofollow, sponsored and UGC links, inspect their HTML, separate link types from indexing, and confirm guest post terms before publishing."
category: "Link Building"
author: "Nasir Haider"
tags: ["Link Building", "Guest Posting", "Link Attributes", "Technical SEO"]
date: "2026-09-15"
readTime: "9 min read"
image: "/images/blog/link-attributes.webp"
imageAlt: "Laptop showing an article and code pane beside a printed proof with blue pencil marks"
---

**Dofollow, nofollow, sponsored and UGC describe how a link is qualified, not whether the article containing it is indexed.** A regular link needs no special qualification; the other labels help explain the relationship behind it. Before accepting a guest post placement, check the actual markup and the reason the link exists.

This matters when a publisher offers a “permanent, dofollow, indexed link.” Those are three separate claims. A single screenshot of blue underlined text cannot verify all of them.

## Dofollow vs nofollow vs sponsored vs UGC

Use this comparison to understand the labels you may see in an order sheet or publisher reply.

| Link label | Typical HTML | What it communicates |
| --- | --- | --- |
| Dofollow / regular | No qualifying `rel` value | An ordinary, unqualified link |
| Nofollow | `rel="nofollow"` | The publisher does not want to imply endorsement |
| Sponsored | `rel="sponsored"` | Advertising, sponsorship or a paid placement |
| UGC | `rel="ugc"` | A link within user-generated content, such as a forum post |

Google recommends `sponsored` for paid links; `nofollow` remains acceptable for that purpose. More than one value can appear on the same link. These definitions follow [Google’s outbound-link guidance](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links).

## What does “dofollow” actually mean?

Dofollow is common SEO shorthand, not a special attribute you need to add. An ordinary link can look like this:

```html
<a href="https://example.com/checklist">Publisher review checklist</a>
```

Do not ask an editor to add `rel="dofollow"` as proof of delivery. Instead, inspect whether the actual link has a qualification and check the page-level settings separately.

Also keep the commercial context in view. A “dofollow” label is not evidence of a relevant audience, an independent recommendation or a successful campaign. Our [publisher-vetting guide](/blog/how-to-vet-guest-post-sites) covers those separate checks.

## Nofollow is a hint, not a ranking promise

Google describes `nofollow`, `sponsored` and `ugc` as hints used with other signals when analysing links. That is more nuanced than either “Google ignores every nofollow link” or “nofollow now passes the same value as any other link.” See [Google’s explanation of the hint model](https://developers.google.com/search/blog/2019/09/evolving-nofollow-new-ways-to-identify).

For planning purposes, do not assign a guaranteed ranking benefit to a particular attribute. A publisher can control the delivered markup; it cannot demonstrate how much ranking credit Google assigned to one link.

The following examples show a reference qualified as nofollow and a paid placement with two values. The example URLs are illustrative, not recommended publishers.

```html
<a href="https://example.com/reference" rel="nofollow">Background reading</a>

<a href="https://example.com/service" rel="sponsored nofollow">Service details</a>
```

Record the complete value. Reducing `sponsored nofollow` to only “sponsored” makes a delivery record less precise.

## Paid guest posts need an honest commercial label

Google’s link-spam policy covers buying or selling links for ranking purposes, including paid articles that pass ranking credit. It permits advertising and sponsorship links when appropriately qualified with `sponsored` or `nofollow`. A useful article or an editorial review does not turn a paid ranking link into an exception. [Google’s link-spam policy](https://developers.google.com/search/docs/essentials/spam-policies#link-spam).

For a paid campaign, agree on audience fit, the article contribution, distribution and reporting. Do not make removal of the appropriate qualification a condition of acceptance.

Keep the visible disclosure and HTML qualification in separate fields. A reader-facing “Sponsored” notice and an attribute in the link’s code are different things; checking one does not verify the other. Ask the publisher to explain both before confirming the order.

## A nofollow link does not mean a noindex article

`noindex` is a page-level indexing instruction, usually supplied through a robots meta tag or an HTTP response header. It is not another name for a link’s `nofollow` attribute. Google must be able to crawl the page to see its `noindex` instruction. [Google’s noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

For example, an article may be eligible for indexing while its commercial link is qualified as sponsored. Conversely, an ordinary-looking link can sit on a page carrying `noindex`.

Separate your checks into:

- **Link markup:** the exact destination, anchor text and `rel` values.
- **Page settings:** robots instructions, HTTP status and canonical URL.
- **Observed indexing:** dated evidence about that exact article URL.

Eligibility is not confirmation of indexing. Use our [guest post indexing workflow](/blog/check-guest-post-indexing) when you need to investigate the page, and leave the status unverified when you lack evidence.

## How to check a link in the browser

You do not need a paid backlink tool to inspect one delivered link. In a desktop browser, open the live article and locate the exact anchor.

1. Right-click the linked text and choose **Inspect**.
2. In the Elements panel, locate the surrounding `<a>` element. If a `<span>` inside it is selected, move up to the parent link.
3. Read `href` to confirm the destination and `rel` to record its values.
4. Open the link normally and confirm its final destination after any redirects.
5. Save the article URL, observation date and a screenshot showing the relevant markup.

Chrome documents this inspection method in its [Elements-panel guide](https://developer.chrome.com/docs/devtools/dom). Inspecting the rendered element is especially useful when scripts have changed the page after its initial HTML loaded.

Do not classify the whole website from one link. An author bio, an article-body citation and a reader comment can have different attributes on the same page. Likewise, a sample article checked before ordering does not prove what the final placement will contain.

If the check is unclear, ask the publisher for help. Avoid editing values in DevTools and treating the resulting screenshot as publication evidence; that changes your local view, not the publisher’s saved page.

## What about noopener and noreferrer?

These values can appear beside SEO-related qualifications, but they serve other purposes. `noopener` prevents a newly opened page from accessing the window that opened it. It does not mean `nofollow`. [MDN’s noopener reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener).

`noreferrer` suppresses referrer information sent during navigation and also provides noopener behaviour. That distinction can matter when reviewing referral reporting. [MDN’s noreferrer reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer).

For instance, `rel="noopener noreferrer"` alone does not contain a nofollow qualification. Read the individual values rather than treating any nonempty `rel` attribute as proof of nofollow.

If referral attribution is important, agree on a consistently tagged campaign URL where supported, then test the final link. Do not remove a publisher’s security or privacy settings merely to make a report look cleaner.

## Three placement decisions in practice

These are hypothetical situations, not audited publishers or client results.

### An unpaid expert contribution

A specialist publication commissions an unpaid explanation of a problem its readers face. The editor independently chooses to cite a genuinely relevant resource.

Review the final article, the citation’s context and the delivered markup. Keep evidence of the editorial arrangement. Do not convert an optional reference into a mandatory keyword-rich link, and do not describe the publication as valuable solely because the link is unqualified.

### A paid industry feature

A publisher offers an article, a visible sponsorship notice and a link qualified as `sponsored nofollow`.

Assess the offer against its stated purpose: relevant reach, distribution and qualified visits. Confirm which promotional channels are included and what reporting the publisher can supply. If the offer only makes sense when treated as guaranteed ranking credit, revisit the campaign objective before buying.

### A community answer

A forum member recommends your checklist in a useful answer, and the forum applies `ugc` to the link.

Record it as a community mention rather than a commissioned guest post. Consider whether it is helping readers and sending useful visits. Do not pressure moderators to remove their chosen label or post repetitive answers just to increase your backlink count.

The practical lesson is to name the relationship accurately before deciding how to evaluate it.

## Confirm these details before placing an order

A clean delivery record keeps promises and observations distinct:

| Field | What to record |
| --- | --- |
| Arrangement | Editorial contribution, advertising or community mention |
| Proposed location | Article body, author bio or another specified section |
| Destination | Agreed URL and any campaign parameters |
| Link wording | Descriptive anchor or an agreed editorial alternative |
| Qualification | Expected values, then the exact observed `rel` value |
| Visible disclosure | Publisher’s stated label and its final location |
| Page checks | Status, robots instructions, canonical and check date |
| Delivery terms | Publication date, retention terms and correction process |

For an unanswered question, use **unverified** instead of filling in a preferred value. In particular, do not automatically translate “permanent guest post” into “dofollow and indexed.”

A concise publisher question is: “Please confirm the link location, exact rel values, visible disclosure, destination URL and correction policy. We will check the final article after publication.”

This is a practical confirmation checklist, not a substitute for a publisher’s full agreement. Recheck older placements if their continued availability matters to the campaign.

## Evaluate outcomes without chasing an attribute ratio

Use the distribution of link types as a review signal, not a target to manufacture. A sudden change may reflect a publisher’s template update, a reporting difference or a campaign decision. Investigate the affected URLs before drawing conclusions.

For each important placement, ask whether it reaches an appropriate audience, explains your resource fairly and supports a useful next step. Track meaningful enquiries alongside visits. A link label alone cannot answer those business questions.

The [guest posting measurement guide](/blog/measure-guest-posting-results) explains how to separate referral activity, enquiries and organic observations. Keep the technical delivery check alongside that report; neither replaces the other.

## A final review before signing off

Confirm the actual relationship, inspect the exact link and verify page-level claims separately. Keep written terms and dated evidence, and flag missing information openly.

**The most useful link report tells you what was delivered, why it belongs there and what you can actually verify.** It does not turn a particular attribute into a guarantee of rankings.

Need a publisher shortlist for your topic? [Contact Web Grouth](/contact) with your website, audience and campaign goal so the proposed placements and their terms can be reviewed together.
