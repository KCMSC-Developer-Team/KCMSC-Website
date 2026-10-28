# KCMSC Legacy URL Migration Audit

Date: 2026-10-28

## Scope and safety

This review uses the uploaded `KCMSC - Website.zip` and publicly accessible pages on `https://kcmsc.edu.bd/`.
The application source was inspected before changes. The edits in this package are limited to:

- `next.config.mjs`: explicit permanent redirects for legacy URLs with a verified or strongly equivalent destination.
- `src/app/[locale]/teachers/page.tsx`: safely accepts an optional, allow-listed `wing` search parameter and passes it to the existing directory.
- `src/app/[locale]/teachers/TeachersDirectory.tsx`: initializes the existing wing filter from that validated parameter.
- This report.

No database schema, migration, seed, DB query behavior, environment file, authentication, or existing page design was changed. No deployment, DNS, or hosting operation was performed.

## Verified mappings added

| Legacy path | New destination | Reason |
|---|---|---|
| `/contact-us/` | `/en/contact` | Direct contact-page equivalent |
| `/chairmans-message/` | `/en/leadership-messages` | New site consolidates leadership messages |
| `/vice-chairmans-message/` | `/en/leadership-messages` | New site consolidates leadership messages |
| `/chief-advisors-message/` | `/en/leadership-messages` | New site consolidates leadership messages |
| `/principals-message/` | `/en/leadership-messages` | New site consolidates leadership messages |
| `/kcmsc-2026/our-team/junior-teacher/` | `/en/teachers?wing=Junior%20Wing` | Preserves intent by opening the existing directory with Junior Wing selected |
| `/kcmsc-2026/our-team/senior-teacher/` | `/en/teachers?wing=Senior%20Wing` | Preserves intent by opening the existing directory with Senior Wing selected |
| `/kcmsc-2026/our-team/administration/` | `/en/teachers?wing=Administration` | Opens the existing directory with Administration selected |
| `/notice/` | `/en/notices` | Notice archive equivalent |
| `/category/notice/` | `/en/notices` | Notice archive equivalent |
| `/career-2026/` | `/en/careers` | Career section equivalent |
| `/events/` | `/en/events` | Events section equivalent |
| `/admission/` | `/en/admissions` | Admissions landing-page equivalent |

The redirects are permanent (`308` behavior as implemented by Next.js permanent redirects). No catch-all redirect was added, and no unknown URL is sent to the homepage.

## Legacy pages deliberately NOT redirected yet

These URLs contain content that is not demonstrably equivalent to an existing new route. Redirecting them to a vaguely related page could lose useful information and should not be treated as a completed migration.

| Legacy path | Why unresolved | Safe next action |
|---|---|---|
| `/admission/tuition-other-fees/` | The new admissions page does not contain a verified equivalent fees section. | Create/verify a dedicated fees destination using institution-approved content, then map this URL. |
| `/gallery/video/` | The new Events page is not a verified replacement for the old video gallery. | Preserve the actual videos and create/verify a video-gallery destination. |
| `/gallery/photo-gallery/` | No dedicated new photo-gallery route was found. | Preserve the photo gallery or map to a verified equivalent. |
| `/admission/syllabus/` | The new downloads page is a general resources landing page; syllabus files were not verified in the supplied project as an equivalent collection. | Inventory the old syllabus links/files and preserve them in the new downloads area before redirecting. |
| `/admission/uniform/` | No dedicated uniform-information destination was confirmed. | Preserve the uniform details and any linked document. |
| `/admission/school-college-timing/` | No dedicated timing page was confirmed. | Preserve the official schedule content before mapping. |
| `/downloads/` | The new downloads page exists, but every legacy file and its stable URL have not been inventoried. | Keep the landing-page mapping under review and migrate/verify each file URL separately. |
| `/facilities/computer-lab/`, `/facilities/science-lab/`, `/facilities/library/`, `/facilities/transport/`, `/facilities/taekwondo/`, `/facilities/digital-classroom/`, `/facilities/music-club/`, `/facilities/it-photography-club/` | The new facilities page is an overview and does not prove each old page's content is present. | Compare each old page's content and media before redirecting to `/en/facilities`. |
| `/achievements/`, `/achievements/result/`, `/achievements/sports/`, `/achievements/magazine/`, `/achievements/tv-programme/` | Existing new achievements route redirects to academics, which is not proven to preserve each legacy page's content. | Review and correct the new route's destination/content before migration. |
| `/gallery/` | No exact gallery landing-page equivalent was confirmed. | Verify new media/gallery capability before mapping. |

## New-site routes found in the uploaded source

The public localized route set includes: home, about, academics, achievements, admissions, alumni, blog, calendar, careers, class routine, clubs, contact, downloads, events, facilities, help, leadership messages, login, notices, scholarships, student life, teachers, virtual campus, and why KCMSC. The application also has separate admin, officer, teacher, and blogger workspaces; those are not public legacy-page destinations and were not changed.

## Validation performed

- `node --check next.config.mjs`: passed.
- The redirect list is explicit and does not use a wildcard/catch-all.
- The `wing` query value is validated against a fixed allow-list before it reaches the existing teacher-directory filter.
- Full `npm run build` was not run because the uploaded archive does not include `node_modules`; it must be run in the project environment before deployment.
- Redirect behavior, trailing-slash normalization, query preservation, and each target page still require local HTTP smoke tests.

## Important limitation

This is a conservative route-matching patch, not proof that every URL on the old domain has been discovered. The old site's `robots.txt` and sitemap endpoints were inaccessible to the browsing tool during this review, and the ZIP does not include a complete export of the old website. The unresolved list must be completed before launch; do not treat this report as permission to switch production traffic.
