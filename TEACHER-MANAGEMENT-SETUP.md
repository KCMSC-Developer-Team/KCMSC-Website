# KCMSC Teacher Management Feature

This patch adds teacher records, staff-ID login accounts, an admin import/management page, teacher self-service profiles, and a public directory with full profile pages.

## Files added/changed

- `prisma/schema.prisma`: `TeacherProfile`, `TEACHER` role and User relation.
- `prisma/migrations/20261016140000_teacher_management/migration.sql`: database migration.
- `/admin/teachers`: manually add/edit teachers, import Excel/CSV, assign subjects/wings, activate accounts, publish profiles.
- `/teacher/login` and `/teacher/dashboard`: staff-ID login and profile editor.
- `/api/admin/teachers`: admin-only create/import/publish/deactivate endpoints.
- `/api/teacher/profile` and `/api/teacher/password`: authenticated teacher self-service endpoints.
- `/[locale]/teachers` and `/[locale]/teachers/[id]`: compact public directory and full profile page.

## Install and deploy

1. Back up the database before applying schema changes.
2. From the project directory, run `npm install` (the Excel reader is a new dependency and this updates `package-lock.json`).
3. Run `npx prisma generate`.
4. Apply the migration with `npx prisma migrate deploy` in the target environment.
5. Run `npm run build` and deploy the application.
6. Sign in to `/admin`, open **Teachers & faculty**, and upload `Teacher List.xlsx`.
7. Assign wings and subjects to imported teachers, fill in missing qualification/university details, and publish approved profiles.
8. Teachers sign in at `/teacher/login` using their Employee ID as both username and temporary password. They must change the temporary password on first login.

## Import behavior

- Recognises `ID No.`, `Name`, and `Designation` in the provided workbook.
- Optional columns: `Wing`, `Subject`/`Subjects`, `Highest Degree`/`Degree`, and `University`.
- Existing Employee IDs are updated instead of duplicated. If an imported workbook omits subjects or wings, existing assignments are preserved; new records without assignments are marked `Unassigned` and can be edited from the admin panel.
- New teacher profiles are unpublished by default. Administrators must explicitly publish them.
- Import reports created, updated, skipped rows and a limited list of row errors.

## Security notes

Passwords are hashed with the project's existing bcrypt helper. The initial password is the Employee ID as requested, but the teacher portal requires a password change before profile editing. Never send the spreadsheet of initial passwords through a public channel. Employee IDs are not secret, so this temporary credential policy should be treated as an onboarding convenience rather than strong authentication.
