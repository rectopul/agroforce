/*
  Warnings:

  - You are about to drop the column `dt_import` on the `genotipo` table. All the data in the column will be lost.
  - Added the required column `dt_import` to the `lote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `genotipo` DROP COLUMN `dt_import`;

-- AlterTable
ALTER TABLE `lote` ADD COLUMN `dt_import` DATETIME(3) NOT NULL;
