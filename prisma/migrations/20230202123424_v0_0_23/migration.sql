/*
  Warnings:

  - You are about to drop the column `idOperation` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the column `madeBy` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `reportes` table. All the data in the column will be lost.
  - You are about to drop the `PrintHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idSafra,groupValue,npe]` on the table `experiment_genotipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oldValue` to the `reportes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reportes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `PrintHistory` DROP FOREIGN KEY `PrintHistory_experimentGenotypeId_fkey`;

DROP TABLE `PrintHistory`;
-- DropForeignKey
ALTER TABLE `PrintHistory` DROP FOREIGN KEY `PrintHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reportes` DROP FOREIGN KEY `reportes_madeBy_fkey`;

-- AlterTable
ALTER TABLE `experiment_genotipe` ADD COLUMN `groupValue` INTEGER NULL;

-- AlterTable
ALTER TABLE `log_import` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `reportes` DROP COLUMN `idOperation`,
    DROP COLUMN `madeBy`,
    DROP COLUMN `name`,
    ADD COLUMN `oldValue` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable

-- CreateIndex
CREATE UNIQUE INDEX `experiment_genotipe_idSafra_groupValue_npe_key` ON `experiment_genotipe`(`idSafra`, `groupValue`, `npe`);

-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
