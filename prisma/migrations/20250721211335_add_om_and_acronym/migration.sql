/*
  Warnings:

  - A unique constraint covering the columns `[acronym]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[omcNumber]` on the table `CorrectiveCall` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN "acronym" TEXT;

-- AlterTable
ALTER TABLE "CorrectiveCall" ADD COLUMN "omcNumber" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PreventiveTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ompNumber" TEXT,
    "description" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "checklist" TEXT,
    "assetId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PreventiveTask_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PreventiveTask" ("assetId", "checklist", "createdAt", "description", "frequency", "id", "ompNumber", "startDate", "updatedAt") SELECT "assetId", "checklist", "createdAt", "description", "frequency", "id", "ompNumber", "startDate", "updatedAt" FROM "PreventiveTask";
DROP TABLE "PreventiveTask";
ALTER TABLE "new_PreventiveTask" RENAME TO "PreventiveTask";
CREATE UNIQUE INDEX "PreventiveTask_ompNumber_key" ON "PreventiveTask"("ompNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_acronym_key" ON "Contract"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectiveCall_omcNumber_key" ON "CorrectiveCall"("omcNumber");
