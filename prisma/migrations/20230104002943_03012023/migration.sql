/*
  Warnings:

  - Added the required column `idSafra` to the `log_import` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_import` ADD COLUMN `idSafra` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `log_import` ADD CONSTRAINT `log_import_idSafra_fkey` FOREIGN KEY (`idSafra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
