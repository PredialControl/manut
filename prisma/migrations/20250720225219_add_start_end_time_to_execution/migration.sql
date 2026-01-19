/*
  Warnings:

  - You are about to drop the column `executedAt` on the `Execution` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Execution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "correctiveCallId" TEXT,
    "preventiveTaskId" TEXT,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "checklistResults" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Execution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Execution_correctiveCallId_fkey" FOREIGN KEY ("correctiveCallId") REFERENCES "CorrectiveCall" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Execution_preventiveTaskId_fkey" FOREIGN KEY ("preventiveTaskId") REFERENCES "PreventiveTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Execution" ("checklistResults", "correctiveCallId", "createdAt", "description", "id", "preventiveTaskId", "updatedAt", "userId") SELECT "checklistResults", "correctiveCallId", "createdAt", "description", "id", "preventiveTaskId", "updatedAt", "userId" FROM "Execution";
DROP TABLE "Execution";
ALTER TABLE "new_Execution" RENAME TO "Execution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
