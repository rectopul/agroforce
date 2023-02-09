/*
  Warnings:

  - You are about to alter the column `peso` on the `lote` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,0)` to `Decimal(12,5)`.

*/
-- AlterTable
ALTER TABLE `lote` MODIFY `peso` DECIMAL(12, 5) NULL;
