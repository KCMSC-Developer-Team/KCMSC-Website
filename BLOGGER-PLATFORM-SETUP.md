# KCMSC Blogger Platform - Installation and safety notes

This patch integrates the blogging workflow into the existing Next.js 14 / Prisma 5 application. It is additive and does not reset existing data.

## Included
- Bilingual public blog route and article pages
- Student/teacher application form with server-side validation
- Admin application queue and approve/reject workflow
- Blogger credentials login using school ID and password
- Blogger dashboard with article counts and views
- Draft/publish article API and rich-text toolbar (bold, italic, underline, headings, lists, links, blockquotes)
- Clipboard image paste (up to 1 MB per image)
- Password change page
- Role-aware middleware and navigation entry
- Prisma schema additions and additive SQL migration
- Sanitization of article HTML before it is saved/rendered

## Before using
1. Back up the database and the project.
2. Review the added migration at `prisma/migrations/20261016000000_blogger_platform/migration.sql`.
3. Install dependencies using `npm install` (the package manifest adds `sanitize-html` and its TypeScript types).
4. Run `npx prisma validate` and `npx prisma generate`.
5. Apply the migration only after review, with `npx prisma migrate deploy` in the intended environment.
6. Run `npm run build` and test the application on a staging database before production.

## Initial credentials
For compatibility with the requested workflow, an approved blogger's initial password is their school ID. They should immediately change it in Blogger Dashboard → Account settings. This is weaker than a one-time activation link; replace it with a verified email activation flow before opening applications broadly.

## Important implementation limitations to resolve before production
- The current editor is a lightweight contenteditable editor, not the full WordPress/Tiptap editing experience. It supports basic formatting and clipboard-pasted images; image storage currently uses data URLs inside article content, so image size limits matter.
- The schema includes name-change request records, but the name-change request and admin review UI still need to be implemented before enabling name changes.
- Article moderation controls (hide/unpublish/delete), abuse reporting, and audit logging for blog actions should be added before broad public launch.
- Application endpoints should have shared-store rate limiting and CAPTCHA/abuse controls before public launch.
- The existing project uses a per-process login rate limiter; that is not sufficient as a distributed production rate limiter.
- Existing database data is not modified by the migration, but PostgreSQL enum changes and all migrations must be tested against a backup/staging database first.

## Routes
- `/{locale}/blog`
- `/{locale}/blog/{slug}`
- `/{locale}/blog/apply`
- `/blogger/login`
- `/blogger/dashboard`
- `/blogger/articles/new`
- `/blogger/profile`
- `/admin/blog/applications`
