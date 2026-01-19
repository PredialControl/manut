/*
  Warnings:

  - You are about to drop the column `details` on the `MaintenanceTaskTemplate` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChecklistItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "MaintenanceTaskTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MaintenanceTaskTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "periodicity" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaintenanceTaskTemplate_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MaintenancePlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MaintenanceTaskTemplate" ("createdAt", "id", "periodicity", "planId", "updatedAt") SELECT "createdAt", "id", "periodicity", "planId", "updatedAt" FROM "MaintenanceTaskTemplate";
DROP TABLE "MaintenanceTaskTemplate";
ALTER TABLE "new_MaintenanceTaskTemplate" RENAME TO "MaintenanceTaskTemplate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
