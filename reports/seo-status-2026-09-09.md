# Web Grouth SEO delivery record

Prepared: 9 September 2026. Preferred URL: https://www.webgrouth.com/.

Service coverage is worldwide. The USA and UK are priority acquisition markets, not a restriction on the countries served. No local offices, new client results, traffic estimates or first-place ranking claims have been invented.

## Implemented in this release

- Responsive WebP variants generated from the existing images during the build, without changing their artwork. Original public image URLs remain available.
- Responsive image selection, reserved dimensions, lazy loading for smaller cards, and high priority for the main article/featured image.
- Page-specific social images and Twitter/Open Graph metadata using the existing brand imagery.
- Consistent, clean canonical URLs with query strings and fragments excluded.
- Complete organization author information and modification dates in article structured data; linked visible bylines.
- Breadcrumb structured data for standard pages, with existing article breadcrumbs preserved.
- Sitemap coverage based on an explicit route inventory; article image URLs and real article update dates included. Unknown static modification dates are omitted rather than invented.
- An RSS feed for the four journal articles.
- Main content visible before JavaScript runs; animation only enhances content further down the page.
- Offer dialog opens on an intentional click. Readers are no longer interrupted by a timer or scrolling threshold.
- Additional, specific content and FAQs for guest posting, link insertion and off-page SEO services.
- Contextual links between service pages, comparison guides, the quality checklist and order/guarantee information.
- Visible founder contact information consistent with the existing organization data.
- Free website-review worksheet linked from the checklist, related articles and footer navigation.
- Optional Google/Bing verification fields, disabled until real verification tokens are supplied.

The existing homepage design, contact details, forms, order process, pricing terms and worldwide inventory claims were preserved. The publisher list is described as examples rather than as a real-time data connection.

## Verification

The candidate revision `a7c8817beb424ac410a04d7256f5b66d24f714ca` passed the Vercel preview build before promotion. The build command explicitly runs image optimization, Astro generation and the SEO audit. Publication stops if a required check fails.

The audit covers the 19 generated HTML pages, including 16 indexable pages and the three utility/error pages. Checks include unique titles and descriptions, one H1, clean canonical URLs, robots directives, language and viewport, social image existence, valid JSON-LD, article author/date fields, breadcrumb coverage, image dimensions and srcsets, internal routes and anchors, sitemap completeness, article-feed counts, and unwanted tool attribution URLs. Preview output is excluded from indexing; production pages use their normal indexing rules.

The audit writes `reports/build-seo.json` during each build, including actual image byte savings and any warnings. This is a build artifact, not a claim of a Google PageSpeed score. Full local production-image testing was unavailable because the connected source reader could not materialize the binary originals; the hosting build tested those originals from the repository.

## Not yet verified or executed

| Work | Current status | Required next input/action |
| --- | --- | --- |
| Search Console ownership | Unknown; absence of a meta tag does not rule out DNS verification | Open the property or provide its verification screen |
| Sitemap submission | Sitemap generated; account submission not confirmed | Submit `/sitemap.xml` in the verified property |
| Google-selected canonicals and indexing | Not inspected in Search Console | URL Inspection and Pages report |
| USA/UK keyword and traffic baseline | Not available | Performance exports with Queries, Pages and Countries |
| GA4 and lead measurement | No measurement ID supplied or activated | Existing property details and agreed tracking/consent setup |
| PageSpeed/Core Web Vitals | Resource and rendering fixes implemented; no new lab/field score obtained | Mobile/desktop PageSpeed run and available Search Console field data |
| Live redirect/status recheck | Existing root index redirects preserved; fresh HTTP status verification pending | Verify HTTP/HTTPS, host preference, index aliases and a true 404 on the live host |
| Google Rich Results Test | Build-level schema checks passed; Google's interactive test not run | Test homepage, service and article URLs |
| Business listings and editorial coverage | Shortlist researched; no applications or pitches sent in this release | Owner accounts, factual business details and original case evidence |
| New external backlinks | Zero created in this release | Accepted, published placements with recorded live URLs |

No dedicated near-duplicate country landing pages were added. The existing USA/UK guide serves a specific educational purpose; service pages remain global. Further pages should be justified by actual search queries and distinct useful content.

## Primary references

- [Google: helpful, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: unobtrusive dialogs](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
- [Google: Search Console reports](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- [Google: paid-link attributes](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
