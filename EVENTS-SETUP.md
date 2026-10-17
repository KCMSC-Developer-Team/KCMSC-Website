# KCMSC Events management

The Student Life page now reads published events from the `Event` table. Administrators manage them at `/admin/events`.

## Database

Apply the migration in `prisma/migrations/20261017140000_add_events/migration.sql` to the configured PostgreSQL database, then regenerate Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

For a local development database, use `npx prisma migrate dev` instead of `migrate deploy` if you want Prisma to manage migration application.

## Event fields

- English and Bangla titles, short summaries and full descriptions
- Start/end date and time, venue in both languages
- Compressed WebP cover photo uploaded from the admin form
- Additional public photo URLs or local public paths, one per line
- Draft/published state and featured flag

Only published events appear on the public Student Life page. The section stays hidden until at least one event is published.
