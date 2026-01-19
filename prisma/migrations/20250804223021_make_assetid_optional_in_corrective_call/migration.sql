-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CorrectiveCall" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "omcNumber" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assetId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CorrectiveCall_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CorrectiveCall" ("assetId", "createdAt", "description", "id", "omcNumber", "priority", "status", "title", "updatedAt") SELECT "assetId", "createdAt", "description", "id", "omcNumber", "priority", "status", "title", "updatedAt" FROM "CorrectiveCall";
DROP TABLE "CorrectiveCall";
ALTER TABLE "new_CorrectiveCall" RENAME TO "CorrectiveCall";
CREATE UNIQUE INDEX "CorrectiveCall_omcNumber_key" ON "CorrectiveCall"("omcNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
