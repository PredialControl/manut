-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "acronym" TEXT,
    "cnpj" TEXT,
    "address" TEXT,
    "sindico" TEXT,
    "status" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contract" ("acronym", "address", "cnpj", "createdAt", "id", "name", "sindico", "status", "updatedAt") SELECT "acronym", "address", "cnpj", "createdAt", "id", "name", "sindico", "status", "updatedAt" FROM "Contract";
DROP TABLE "Contract";
ALTER TABLE "new_Contract" RENAME TO "Contract";
CREATE UNIQUE INDEX "Contract_acronym_key" ON "Contract"("acronym");
CREATE INDEX "Contract_deleted_idx" ON "Contract"("deleted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
