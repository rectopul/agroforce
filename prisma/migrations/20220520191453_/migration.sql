/*
  Warnings:

  - You are about to drop the column `address` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `id_epoca` on the `npe` table. All the data in the column will be lost.
  - You are about to drop the column `typeCrop` on the `safra` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `sequencia_delineamento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cod_local]` on the table `local` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cod_red_local]` on the table `local` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genotipo` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tecnologia` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cod_local` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_farm` to the `local` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_epoca_fkey`;

-- AlterTable
ALTER TABLE `genotipo` ADD COLUMN `genotipo` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_tecnologia` INTEGER NOT NULL,
    MODIFY `genealogy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `local` DROP COLUMN `address`,
    DROP COLUMN `name`,
    ADD COLUMN `cod_local` VARCHAR(191) NOT NULL,
    ADD COLUMN `cod_red_local` VARCHAR(191) NULL,
    ADD COLUMN `name_farm` VARCHAR(191) NOT NULL,
    MODIFY `latitude` VARCHAR(191) NULL,
    MODIFY `longitude` VARCHAR(191) NULL,
    MODIFY `altitude` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `npe` DROP COLUMN `id_epoca`,
    ADD COLUMN `epoca` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `safra` DROP COLUMN `typeCrop`,
    MODIFY `plantingStartTime` VARCHAR(191) NULL,
    MODIFY `plantingEndTime` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sequencia_delineamento` DROP COLUMN `name`;

-- AlterTable
ALTER TABLE `tecnologia` ADD COLUMN `cod_tec` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `desc` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `local_cod_local_key` ON `local`(`cod_local`);

-- CreateIndex
CREATE UNIQUE INDEX `local_cod_red_local_key` ON `local`(`cod_red_local`);

-- AddForeignKey
ALTER TABLE `genotipo` ADD CONSTRAINT `genotipo_id_tecnologia_fkey` FOREIGN KEY (`id_tecnologia`) REFERENCES `tecnologia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
