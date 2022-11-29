/*
  Warnings:

  - Added the required column `id_culture` to the `lote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lote` ADD COLUMN `id_culture` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `lote_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
