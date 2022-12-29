/*
  Warnings:

  - You are about to drop the column `changedAt` on the `PrintHistory` table. All the data in the column will be lost.
  - You are about to drop the column `changes` on the `PrintHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ncc,id_culture]` on the table `lote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PrintHistory` DROP COLUMN `changedAt`,
    DROP COLUMN `changes`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `modulo` VARCHAR(191) NOT NULL DEFAULT 'ETIQUETAGEM';

-- AlterTable
ALTER TABLE `experiment_genotipe` ADD COLUMN `groupId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `lote_ncc_id_culture_key` ON `lote`(`ncc`, `id_culture`);

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
