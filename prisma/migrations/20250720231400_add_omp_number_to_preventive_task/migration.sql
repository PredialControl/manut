/*
  Warnings:

  - A unique constraint covering the columns `[ompNumber]` on the table `PreventiveTask` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PreventiveTask" ADD COLUMN "ompNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "PreventiveTask_ompNumber_key" ON "PreventiveTask"("ompNumber");
