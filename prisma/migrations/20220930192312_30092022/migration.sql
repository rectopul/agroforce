/*
  Warnings:

  - Added the required column `bgm` to the `experiment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assay_list` MODIFY `bgm` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `experiment` ADD COLUMN `bgm` VARCHAR(191) NOT NULL;
