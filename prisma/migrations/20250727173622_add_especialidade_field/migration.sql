-- AlterTable
ALTER TABLE "ConstructionItem" ADD COLUMN "especialidade" TEXT;

-- CreateIndex
CREATE INDEX "ConstructionItem_especialidade_idx" ON "ConstructionItem"("especialidade");
