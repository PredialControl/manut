/*
  Warnings:

  - You are about to drop the column `periodicity` on the `MaintenanceTaskTemplate` table. All the data in the column will be lost.
  - Added the required column `atividade` to the `MaintenanceTaskTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodicidade` to the `MaintenanceTaskTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsavel` to the `MaintenanceTaskTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sistema` to the `MaintenanceTaskTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MaintenanceTaskTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sistema" TEXT NOT NULL,
    "atividade" TEXT NOT NULL,
    "periodicidade" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaintenanceTaskTemplate_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MaintenancePlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MaintenanceTaskTemplate" ("createdAt", "id", "planId", "updatedAt") SELECT "createdAt", "id", "planId", "updatedAt" FROM "MaintenanceTaskTemplate";
DROP TABLE "MaintenanceTaskTemplate";
ALTER TABLE "new_MaintenanceTaskTemplate" RENAME TO "MaintenanceTaskTemplate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
