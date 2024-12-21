-- Reorder columns to put id first
ALTER TABLE "Diary" 
  ALTER COLUMN "id" SET DATA TYPE INTEGER,
  ALTER COLUMN "id" SET NOT NULL,
  ALTER COLUMN "id" SET DEFAULT nextval('"Diary_id_seq"'),
  ALTER COLUMN "id" DROP IDENTITY IF EXISTS;

-- Drop and recreate the table with the desired column order
CREATE TABLE "DiaryNew" (
  "id" INTEGER NOT NULL DEFAULT nextval('"Diary_id_seq"'),
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "mood" TEXT NOT NULL,
  "tags" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- Copy data from old table to new table
INSERT INTO "DiaryNew" SELECT * FROM "Diary";

-- Drop old table and rename new table
DROP TABLE "Diary";
ALTER TABLE "DiaryNew" RENAME TO "Diary"; 