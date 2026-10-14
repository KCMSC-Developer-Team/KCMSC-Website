-- Remove foundation CMS tables that have never been used by the live site.
-- Navigation is defined in the public React layout and Media is currently
-- represented by the checked-in public assets, so neither table has a live
-- read/write path.
DROP TABLE IF EXISTS "NavigationItem" CASCADE;
DROP TABLE IF EXISTS "Media" CASCADE;
