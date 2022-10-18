/*
  Warnings:

  - You are about to drop the column `id_safra` on the `cultureUnity` table. All the data in the column will be lost.
  - You are about to drop the column `bgm` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `dt_import` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `local` table. All the data in the column will be lost.
  - Added the required column `dt_import` to the `cultureUnity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cultureUnity` DROP FOREIGN KEY `cultureUnity_id_safra_fkey`;

-- AlterTable
ALTER TABLE `cultureUnity` DROP COLUMN `id_safra`,
    ADD COLUMN `dt_import` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `experiment` DROP COLUMN `bgm`;

-- AlterTable
ALTER TABLE `local` DROP COLUMN `dt_import`,
    DROP COLUMN `status`,
    MODIFY `adress` VARCHAR(191) NULL,
    MODIFY `mloc` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tecnologia` ALTER COLUMN `dt_import` DROP DEFAULT;
