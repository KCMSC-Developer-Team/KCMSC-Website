-- Optional date and time shown on a notice (stored in UTC; entered in Bangladesh time).
ALTER TABLE "Notice" ADD COLUMN "noticeAt" TIMESTAMP(3);
