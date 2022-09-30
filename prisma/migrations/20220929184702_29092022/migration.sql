/*
  Warnings:

  - You are about to drop the column `period` on the `assay_list` table. All the data in the column will be lost.
  - You are about to drop the column `protocol_name` on the `assay_list` table. All the data in the column will be lost.
  - You are about to drop the column `eel` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_foco` on the `npe` table. All the data in the column will be lost.
  - You are about to drop the column `id_group` on the `npe` table. All the data in the column will be lost.
  - You are about to drop the column `id_local` on the `npe` table. All the data in the column will be lost.
  - You are about to drop the column `id_ogm` on the `npe` table. All the data in the column will be lost.
  - You are about to drop the column `id_safra` on the `npe` table. All the data in the column will be lost.
  - You are about to drop the column `id_type_assay` on the `npe` table. All the data in the column will be lost.
  - You are about to alter the column `larg_q` on the `quadra` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(4,2)`.
  - You are about to alter the column `comp_p` on the `quadra` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(4,2)`.
  - You are about to alter the column `comp_c` on the `quadra` table. The data in that column could be lost. The data in that column will be cast from `Decimal(2,1)` to `Decimal(4,2)`.
  - You are about to drop the `uf` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_safra` to the `cultureUnity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `history_genotype_treatment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_foco_fkey`;

-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_group_fkey`;

-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_local_fkey`;

-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_ogm_fkey`;

-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_safra_fkey`;

-- DropForeignKey
ALTER TABLE `npe` DROP FOREIGN KEY `npe_id_type_assay_fkey`;

-- DropIndex
DROP INDEX `cultureUnity_name_unity_culture_key` ON `cultureUnity`;

-- AlterTable
ALTER TABLE `assay_list` DROP COLUMN `period`,
    DROP COLUMN `protocol_name`,
    ADD COLUMN `treatmentsNumber` INTEGER NULL;

-- AlterTable
ALTER TABLE `cultureUnity` ADD COLUMN `id_safra` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `experiment` DROP COLUMN `eel`,
    ADD COLUMN `blockId` INTEGER NULL,
    ADD COLUMN `experimentGroupId` INTEGER NULL;

-- AlterTable
ALTER TABLE `genotipo` ADD COLUMN `numberLotes` INTEGER NULL;

-- AlterTable
ALTER TABLE `genotype_treatment` ADD COLUMN `status_experiment` VARCHAR(191) NOT NULL DEFAULT 'IMPORTADO';

-- AlterTable
ALTER TABLE `history_genotype_treatment` ADD COLUMN `status` VARCHAR(191) NOT NULL,
    MODIFY `tecnologia` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `npe` DROP COLUMN `id_foco`,
    DROP COLUMN `id_group`,
    DROP COLUMN `id_local`,
    DROP COLUMN `id_ogm`,
    DROP COLUMN `id_safra`,
    DROP COLUMN `id_type_assay`,
    ADD COLUMN `edited` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `focoId` INTEGER NULL,
    ADD COLUMN `groupId` INTEGER NULL,
    ADD COLUMN `localId` INTEGER NULL,
    ADD COLUMN `npei_i` INTEGER NULL DEFAULT 0,
    ADD COLUMN `safraId` INTEGER NULL,
    ADD COLUMN `tecnologiaId` INTEGER NULL,
    ADD COLUMN `typeAssayId` INTEGER NULL;

-- AlterTable
ALTER TABLE `quadra` ADD COLUMN `allocation` VARCHAR(191) NULL DEFAULT 'IMPORTADO',
    MODIFY `larg_q` DECIMAL(4, 2) NOT NULL,
    MODIFY `comp_p` DECIMAL(4, 2) NOT NULL,
    MODIFY `comp_c` DECIMAL(4, 2) NOT NULL;

-- DropTable
DROP TABLE `uf`;

-- CreateTable
CREATE TABLE `experiment_genotipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idSafra` INTEGER NOT NULL,
    `idFoco` INTEGER NOT NULL,
    `idTypeAssay` INTEGER NOT NULL,
    `idTecnologia` INTEGER NOT NULL,
    `idExperiment` INTEGER NOT NULL,
    `idGenotipo` INTEGER NOT NULL,
    `id_seq_delineamento` INTEGER NOT NULL,
    `blockLayoutId` INTEGER NULL,
    `idLote` INTEGER NULL,
    `gli` VARCHAR(191) NOT NULL,
    `rep` INTEGER NOT NULL,
    `nt` INTEGER NOT NULL,
    `npe` INTEGER NOT NULL,
    `nca` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SORTEADO',
    `status_t` VARCHAR(191) NOT NULL DEFAULT 'L',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperimentGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `safraId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `experimentAmount` INTEGER NOT NULL DEFAULT 0,
    `tagsToPrint` INTEGER NULL,
    `tagsPrinted` INTEGER NULL,
    `totalTags` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrintHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `experimentGenotypeId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `changes` INTEGER NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reportes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `madeBy` INTEGER NULL,
    `madeIn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `module` VARCHAR(191) NULL,
    `operation` VARCHAR(191) NULL,
    `idOperation` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AllocatedExperiment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seq` INTEGER NOT NULL,
    `experimentName` VARCHAR(191) NOT NULL,
    `npei` INTEGER NOT NULL,
    `npef` INTEGER NOT NULL,
    `parcelas` INTEGER NOT NULL,
    `blockId` INTEGER NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cultureUnity` ADD CONSTRAINT `cultureUnity_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_safraId_fkey` FOREIGN KEY (`safraId`) REFERENCES `safra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `local`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_focoId_fkey` FOREIGN KEY (`focoId`) REFERENCES `foco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_typeAssayId_fkey` FOREIGN KEY (`typeAssayId`) REFERENCES `type_assay`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_tecnologiaId_fkey` FOREIGN KEY (`tecnologiaId`) REFERENCES `tecnologia`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `quadra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_experimentGroupId_fkey` FOREIGN KEY (`experimentGroupId`) REFERENCES `ExperimentGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idSafra_fkey` FOREIGN KEY (`idSafra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_blockLayoutId_fkey` FOREIGN KEY (`blockLayoutId`) REFERENCES `layout_quadra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idGenotipo_fkey` FOREIGN KEY (`idGenotipo`) REFERENCES `genotipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idFoco_fkey` FOREIGN KEY (`idFoco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idTypeAssay_fkey` FOREIGN KEY (`idTypeAssay`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idTecnologia_fkey` FOREIGN KEY (`idTecnologia`) REFERENCES `tecnologia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_id_seq_delineamento_fkey` FOREIGN KEY (`id_seq_delineamento`) REFERENCES `sequencia_delineamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idExperiment_fkey` FOREIGN KEY (`idExperiment`) REFERENCES `experiment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperimentGroup` ADD CONSTRAINT `ExperimentGroup_safraId_fkey` FOREIGN KEY (`safraId`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrintHistory` ADD CONSTRAINT `PrintHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrintHistory` ADD CONSTRAINT `PrintHistory_experimentGenotypeId_fkey` FOREIGN KEY (`experimentGenotypeId`) REFERENCES `experiment_genotipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AllocatedExperiment` ADD CONSTRAINT `AllocatedExperiment_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `quadra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
