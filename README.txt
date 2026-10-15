KCMSC Careers Page Redesign
===========================

Included:
- src/app/[locale]/careers/page.tsx

Installation:
1. Back up your existing src/app/[locale]/careers/page.tsx.
2. Copy this replacement file into the same path in your project.
3. Keep src/app/[locale]/careers/actions.ts unchanged.
4. Run npm run dev and test /en/careers and /bn/careers.

Logic intentionally preserved:
- Locale validation and dictionary usage
- Published careers fetched from Prisma, newest first
- Existing application server action
- Existing hidden careerId and locale fields
- Existing field names consumed by the server action
- Success, closed, and invalid query-state messages
- Deadline calculation and closed-application behavior
- Empty-state dictionary message
