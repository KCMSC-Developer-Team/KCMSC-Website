# KCMSC website: PostgreSQL to MySQL conversion

This working copy changes the Prisma datasource provider to MySQL for compatibility testing with the current WebhostBD shared-hosting plan.

## Important safety boundaries

- This is a separate project copy. The original ZIP is unchanged.
- Do not upload this project over the live `kcmsc.edu.bd` WordPress document root.
- Use a separate development subdomain and a NEW, dedicated MySQL database/user.
- Do not reuse, modify, or delete the existing WordPress database (`wp855`).
- The former PostgreSQL migration SQL files are archived under `docs/legacy-postgresql-migrations/` for reference. They are NOT valid MySQL migrations and are not active Prisma migrations.

## Before deployment

1. Create a new MySQL database and user in cPanel. Grant the user privileges only on that new database.
2. Configure `DATABASE_URL` privately in the Node.js app environment. Use the MySQL URL format:
   `mysql://USER:PASSWORD@HOST:3306/DATABASE`
   URL-encode special characters in the password. Do not commit credentials into source control.
3. From a local development copy, install dependencies and run:
   `npx prisma validate`
4. Create the initial MySQL schema in the empty test database:
   `npx prisma migrate dev --name init`
   This generates fresh MySQL migration SQL. Inspect the generated migration before applying it anywhere.
5. Run `npx prisma generate`, then `npm run build`.
6. Test sign-in, role checks, admissions, file uploads, admin pages, and all database-backed pages against the test database.
7. Only after successful tests, deploy to `dev.kcmsc.edu.bd`. Keep the current live WordPress website untouched.

## Compatibility warning

Changing the provider is not a one-line guaranteed migration. Prisma supports MySQL, but MySQL and PostgreSQL differ in schema and SQL behavior. Review generated migrations and test the full app. This package has not been built or integration-tested against a live MySQL server.
