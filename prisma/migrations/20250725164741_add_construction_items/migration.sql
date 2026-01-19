-- CreateTable
CREATE TABLE "ConstructionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "openedAt" DATETIME NOT NULL,
    "deadline" DATETIME,
    "feedback" TEXT,
    "contractId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConstructionItem_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ConstructionItem_number_key" ON "ConstructionItem"("number");

-- CreateIndex
CREATE INDEX "ConstructionItem_contractId_idx" ON "ConstructionItem"("contractId");

-- CreateIndex
CREATE INDEX "ConstructionItem_status_idx" ON "ConstructionItem"("status");
