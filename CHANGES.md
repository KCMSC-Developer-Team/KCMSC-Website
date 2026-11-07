# KCMSC UI refresh: design-only changes

Presentation only. No backend, API routes, server actions, auth, middleware, Prisma
schema or links were changed (verified by file comparison against the original).

## How to apply
Copy `src/` and `tailwind.config.ts` from this zip over your project (same paths), then run
`npm install` (no new dependencies) and `npm run dev`.
Deleted file: `src/app/admin/professional-admin.css` (it was not imported anywhere).

## What changed
- Corners: one scale (8/12/16/20px + pill). Removed the `border-radius: 2px !important`
  rules that made admin and inner public pages square.
- Text: all 8-11px text raised to 12px; 13-15px nudged up one step; Tailwind
  text-xs/sm/base/lg/xl are slightly larger. Headings unchanged.
- Login: one shared `AuthShell` for Admin, Faculty, Writer and Accept-invite,
  plus the portal chooser. Form fields, handlers and destinations unchanged.
- Dashboards: Admin, Teacher and Blogger share the same hero, cards, shadows,
  buttons and inputs. Counts animate (CountUp); progress uses animated rings/bars.
- Landing: floating stats card, image cards for focus areas, animated pass-rate rings,
  alumni cards, rounded closing CTA.
- Motion: subtle scroll reveals + scroll progress bar (ScrollEffects), disabled when
  the visitor prefers reduced motion. Content is never hidden without JavaScript.
- Colours: same palette; brighter tints (leaf, mint, gold) added.

## New files
src/components/motion/{ScrollEffects,CountUp,Charts,useInView}
src/components/auth/AuthShell.tsx

## Not verified
A full `next build` could not run in my sandbox (no access to Google Fonts and no
database). TypeScript shows no new errors versus the original. Login pages were
rendered and checked; the landing page and dashboards need a visual check on your
machine with a database.
