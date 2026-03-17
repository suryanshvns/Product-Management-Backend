-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "changeSummary" TEXT,
ADD COLUMN     "newValues" JSONB,
ADD COLUMN     "oldValues" JSONB;
