/*
  Warnings:

  - You are about to drop the column `dt_import` on the `cultureUnity` table. All the data in the column will be lost.
  - You are about to drop the column `dt_import` on the `genotipo` table. All the data in the column will be lost.
  - You are about to drop the column `dt_import` on the `lote` table. All the data in the column will be lost.
  - You are about to drop the column `dt_import` on the `tecnologia` table. All the data in the column will be lost.
  - Added the required column `dt_export` to the `cultureUnity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_export` to the `tecnologia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cultureUnity` DROP COLUMN `dt_import`,
    ADD COLUMN `dt_export` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `genotipo` DROP COLUMN `dt_import`,
    ADD COLUMN `dt_export` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `lote` DROP COLUMN `dt_import`,
    ADD COLUMN `dt_export` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `tecnologia` DROP COLUMN `dt_import`,
    ADD COLUMN `dt_export` DATETIME(3) NOT NULL;
