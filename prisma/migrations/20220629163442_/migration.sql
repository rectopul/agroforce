/*
  Warnings:

  - You are about to alter the column `bgm` on the `genotipo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(12,2)`.
  - You are about to alter the column `gmr` on the `genotipo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(12,2)`.
  - You are about to drop the column `city` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `cod_local` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `cod_red_local` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `name_farm` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `pais` on the `local` table. All the data in the column will be lost.
  - You are about to drop the column `uf` on the `local` table. All the data in the column will be lost.
  - You are about to alter the column `ncc` on the `lote` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(12,0)`.
  - You are about to alter the column `peso` on the `lote` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(5,0)`.
  - You are about to drop the column `group` on the `npe` table. All the data in the column will be lost.
  - You are about to alter the column `tiro_fixo` on the `quadra` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `disparo_fixo` on the `quadra` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `id_safra` on the `type_assay` table. All the data in the column will be lost.
  - You are about to drop the column `type_assayId` on the `type_assay_children` table. All the data in the column will be lost.
  - You are about to drop the `foco_children` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_local_culture]` on the table `local` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adress` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_country` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_local_culture` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_locality` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_region` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_country` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label_region` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mloc` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_country` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_local_culture` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_locality` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_region` to the `local` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_group` to the `npe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `foco_children` DROP FOREIGN KEY `foco_children_id_foco_fkey`;

-- DropForeignKey
ALTER TABLE `foco_children` DROP FOREIGN KEY `foco_children_id_safra_fkey`;

-- DropForeignKey
ALTER TABLE `type_assay` DROP FOREIGN KEY `type_assay_id_safra_fkey`;

-- DropForeignKey
ALTER TABLE `type_assay_children` DROP FOREIGN KEY `type_assay_children_type_assayId_fkey`;

-- DropIndex
DROP INDEX `local_cod_local_key` ON `local`;

-- DropIndex
DROP INDEX `local_cod_red_local_key` ON `local`;

-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `culture` ADD COLUMN `desc` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `genotipo` ADD COLUMN `safraId` INTEGER NULL,
    MODIFY `cruza` VARCHAR(191) NULL,
    MODIFY `bgm` DECIMAL(12, 2) NULL,
    MODIFY `gmr` DECIMAL(12, 2) NULL,
    MODIFY `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `local` DROP COLUMN `city`,
    DROP COLUMN `cod_local`,
    DROP COLUMN `cod_red_local`,
    DROP COLUMN `name_farm`,
    DROP COLUMN `pais`,
    DROP COLUMN `uf`,
    ADD COLUMN `adress` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_country` INTEGER NOT NULL,
    ADD COLUMN `id_local_culture` INTEGER NOT NULL,
    ADD COLUMN `id_locality` INTEGER NOT NULL,
    ADD COLUMN `id_region` INTEGER NOT NULL,
    ADD COLUMN `label` VARCHAR(191) NOT NULL,
    ADD COLUMN `label_country` VARCHAR(191) NOT NULL,
    ADD COLUMN `label_region` VARCHAR(191) NOT NULL,
    ADD COLUMN `mloc` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_country` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_local_culture` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_locality` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_region` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `lote` MODIFY `fase` VARCHAR(191) NULL,
    MODIFY `ncc` DECIMAL(12, 0) NULL,
    MODIFY `peso` DECIMAL(5, 0) NULL,
    MODIFY `quant_sementes` INTEGER NULL,
    MODIFY `year` INTEGER NULL;

-- AlterTable
ALTER TABLE `npe` DROP COLUMN `group`,
    ADD COLUMN `id_group` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `quadra` MODIFY `tiro_fixo` INTEGER NULL,
    MODIFY `disparo_fixo` INTEGER NULL;

-- AlterTable
ALTER TABLE `type_assay` DROP COLUMN `id_safra`;

-- AlterTable
ALTER TABLE `type_assay_children` DROP COLUMN `type_assayId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `login` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `foco_children`;

-- CreateTable
CREATE TABLE `local_children` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_local` INTEGER NOT NULL,
    `id_culture_unity` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `culture_unity_name` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `local_children_culture_unity_name_key`(`culture_unity_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_foco` INTEGER NOT NULL,
    `grupo` INTEGER NOT NULL,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `protocol_name` VARCHAR(191) NOT NULL,
    `experiment_id` INTEGER NOT NULL,
    `experiment_name` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `id_safra` INTEGER NOT NULL,
    `id_foco` INTEGER NOT NULL,
    `id_ensaio` INTEGER NOT NULL,
    `id_tecnologia` INTEGER NOT NULL,
    `epoca` INTEGER NOT NULL,
    `pjr` VARCHAR(191) NOT NULL,
    `id_culture_unity` INTEGER NOT NULL,
    `culture_unity_name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_experiment_bd` INTEGER NOT NULL,
    `id_l1` INTEGER NOT NULL,
    `id_dados` INTEGER NOT NULL,
    `trat` INTEGER NOT NULL,
    `prox_nivel` INTEGER NOT NULL,
    `id_d1` INTEGER NOT NULL,
    `name_main` VARCHAR(191) NOT NULL,
    `name_genotipo` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `local_id_local_culture_key` ON `local`(`id_local_culture`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `user`(`login`);

-- AddForeignKey
ALTER TABLE `local_children` ADD CONSTRAINT `local_children_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genotipo` ADD CONSTRAINT `genotipo_safraId_fkey` FOREIGN KEY (`safraId`) REFERENCES `safra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `group_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `group_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `type_assay_children` ADD CONSTRAINT `type_assay_children_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `type_assay_children` ADD CONSTRAINT `type_assay_children_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_group_fkey` FOREIGN KEY (`id_group`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_id_ensaio_fkey` FOREIGN KEY (`id_ensaio`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_id_tecnologia_fkey` FOREIGN KEY (`id_tecnologia`) REFERENCES `tecnologia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiais` ADD CONSTRAINT `materiais_id_experiment_bd_fkey` FOREIGN KEY (`id_experiment_bd`) REFERENCES `experiment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
