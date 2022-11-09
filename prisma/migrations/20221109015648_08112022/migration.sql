/*
  Warnings:

  - You are about to alter the column `cod_lote` on the `lote` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(15,0)`.

*/
-- AlterTable
ALTER TABLE `log_import` ADD COLUMN `invalid_data` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `lote` MODIFY `cod_lote` DECIMAL(15, 0) NOT NULL;
