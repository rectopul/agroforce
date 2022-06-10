/*
  Warnings:

  - You are about to drop the column `genealogy` on the `genotipo` table. All the data in the column will be lost.
  - You are about to drop the column `genotipo` on the `genotipo` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `lote` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `lote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_dados]` on the table `genotipo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_dados]` on the table `lote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bgm` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gmr` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_dados` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_s1` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_genotipo` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `genotipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cod_lote` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fase` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_dados` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_s2` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_safra` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ncc` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quant_sementes` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_safra` to the `type_assay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `genotipo` DROP COLUMN `genealogy`,
    DROP COLUMN `genotipo`,
    ADD COLUMN `bgm` VARCHAR(191) NOT NULL,
    ADD COLUMN `elit_name` VARCHAR(191) NULL,
    ADD COLUMN `gmr` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_dados` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_s1` INTEGER NOT NULL,
    ADD COLUMN `name_alter` VARCHAR(191) NULL,
    ADD COLUMN `name_experiment` VARCHAR(191) NULL,
    ADD COLUMN `name_genotipo` VARCHAR(191) NOT NULL,
    ADD COLUMN `name_main` VARCHAR(191) NULL,
    ADD COLUMN `name_public` VARCHAR(191) NULL,
    ADD COLUMN `parentesco_completo` VARCHAR(191) NULL,
    ADD COLUMN `progenitor_f_direto` VARCHAR(191) NULL,
    ADD COLUMN `progenitor_f_origem` VARCHAR(191) NULL,
    ADD COLUMN `progenitor_m_direto` VARCHAR(191) NULL,
    ADD COLUMN `progenitor_m_origem` VARCHAR(191) NULL,
    ADD COLUMN `progenitores_origem` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `lote` DROP COLUMN `name`,
    DROP COLUMN `volume`,
    ADD COLUMN `cod_lote` VARCHAR(191) NOT NULL,
    ADD COLUMN `fase` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_dados` INTEGER NOT NULL,
    ADD COLUMN `id_s2` INTEGER NOT NULL,
    ADD COLUMN `id_safra` INTEGER NOT NULL,
    ADD COLUMN `ncc` INTEGER NOT NULL,
    ADD COLUMN `peso` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `quant_sementes` INTEGER NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `type_assay` ADD COLUMN `id_safra` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `assay_type_children` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_type_assay` INTEGER NOT NULL,
    `seeds` INTEGER NOT NULL,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type_assayId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `genotipo_id_dados_key` ON `genotipo`(`id_dados`);

-- CreateIndex
CREATE UNIQUE INDEX `lote_id_dados_key` ON `lote`(`id_dados`);

-- AddForeignKey
ALTER TABLE `type_assay` ADD CONSTRAINT `type_assay_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assay_type_children` ADD CONSTRAINT `assay_type_children_type_assayId_fkey` FOREIGN KEY (`type_assayId`) REFERENCES `type_assay`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `lote_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
