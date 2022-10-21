/*
  Warnings:

  - You are about to alter the column `bgm` on the `assay_list` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `assay_list` MODIFY `bgm` INTEGER NULL;
