/*
  Warnings:

  - You are about to drop the column `culture_unity_name` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `epoca` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `experiment_id` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `experiment_name` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_culture` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_culture_unity` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_ensaio` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_foco` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_safra` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `id_tecnologia` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `pjr` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `protocol_name` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `experiment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `genotipo` table. All the data in the column will be lost.
  - You are about to drop the column `grupo` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `layout_children` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `lote` table. All the data in the column will be lost.
  - You are about to drop the column `local_preparo` on the `quadra` table. All the data in the column will be lost.
  - You are about to alter the column `comp_c` on the `quadra` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(2,1)`.
  - You are about to drop the column `status` on the `tecnologia` table. All the data in the column will be lost.
  - You are about to drop the column `app_login` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `jivochat` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `city` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disparos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `local_children` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materiais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type_assay_children` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clp` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comments` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `density` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eel` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experimentName` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idAssayList` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idDelineamento` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idLocal` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idSafra` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nlp` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderDraw` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repetitionsNumber` to the `experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_local` to the `quadra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protocol_name` to the `type_assay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `disparos` DROP FOREIGN KEY `disparos_id_quadra_fkey`;

-- DropForeignKey
ALTER TABLE `experiment` DROP FOREIGN KEY `experiment_id_culture_fkey`;

-- DropForeignKey
ALTER TABLE `experiment` DROP FOREIGN KEY `experiment_id_ensaio_fkey`;

-- DropForeignKey
ALTER TABLE `experiment` DROP FOREIGN KEY `experiment_id_foco_fkey`;

-- DropForeignKey
ALTER TABLE `experiment` DROP FOREIGN KEY `experiment_id_safra_fkey`;

-- DropForeignKey
ALTER TABLE `experiment` DROP FOREIGN KEY `experiment_id_tecnologia_fkey`;

-- DropForeignKey
ALTER TABLE `local_children` DROP FOREIGN KEY `local_children_id_local_fkey`;

-- DropForeignKey
ALTER TABLE `materiais` DROP FOREIGN KEY `materiais_id_experiment_bd_fkey`;

-- DropForeignKey
ALTER TABLE `quadra` DROP FOREIGN KEY `quadra_local_preparo_fkey`;

-- DropForeignKey
ALTER TABLE `type_assay_children` DROP FOREIGN KEY `type_assay_children_id_safra_fkey`;

-- DropForeignKey
ALTER TABLE `type_assay_children` DROP FOREIGN KEY `type_assay_children_id_type_assay_fkey`;

-- DropIndex
DROP INDEX `genotipo_id_dados_key` ON `genotipo`;

-- AlterTable
ALTER TABLE `experiment` DROP COLUMN `culture_unity_name`,
    DROP COLUMN `epoca`,
    DROP COLUMN `experiment_id`,
    DROP COLUMN `experiment_name`,
    DROP COLUMN `id_culture`,
    DROP COLUMN `id_culture_unity`,
    DROP COLUMN `id_ensaio`,
    DROP COLUMN `id_foco`,
    DROP COLUMN `id_safra`,
    DROP COLUMN `id_tecnologia`,
    DROP COLUMN `label`,
    DROP COLUMN `pjr`,
    DROP COLUMN `protocol_name`,
    DROP COLUMN `year`,
    ADD COLUMN `clp` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `comments` LONGTEXT NOT NULL,
    ADD COLUMN `density` INTEGER NOT NULL,
    ADD COLUMN `eel` DECIMAL(5, 2) NOT NULL,
    ADD COLUMN `experimentName` VARCHAR(191) NOT NULL,
    ADD COLUMN `idAssayList` INTEGER NOT NULL,
    ADD COLUMN `idDelineamento` INTEGER NOT NULL,
    ADD COLUMN `idLocal` INTEGER NOT NULL,
    ADD COLUMN `idSafra` INTEGER NOT NULL,
    ADD COLUMN `nlp` INTEGER NOT NULL,
    ADD COLUMN `orderDraw` INTEGER NOT NULL,
    ADD COLUMN `period` INTEGER NOT NULL,
    ADD COLUMN `repetitionsNumber` INTEGER NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'IMPORTADO';

-- AlterTable
ALTER TABLE `genotipo` DROP COLUMN `status`,
    ADD COLUMN `dt_import` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `parentesco_completo` MEDIUMTEXT NULL;

-- AlterTable
ALTER TABLE `group` DROP COLUMN `grupo`,
    DROP COLUMN `status`,
    ADD COLUMN `group` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `layout_children` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `local` ADD COLUMN `dt_import` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `lote` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `npe` ADD COLUMN `npeQT` INTEGER NULL;

-- AlterTable
ALTER TABLE `quadra` DROP COLUMN `local_preparo`,
    ADD COLUMN `id_local` INTEGER NOT NULL,
    MODIFY `comp_c` DECIMAL(2, 1) NOT NULL;

-- AlterTable
ALTER TABLE `tecnologia` DROP COLUMN `status`,
    ADD COLUMN `dt_import` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `type_assay` ADD COLUMN `protocol_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `app_login`,
    DROP COLUMN `jivochat`;

-- DropTable
DROP TABLE `city`;

-- DropTable
DROP TABLE `disparos`;

-- DropTable
DROP TABLE `local_children`;

-- DropTable
DROP TABLE `materiais`;

-- DropTable
DROP TABLE `type_assay_children`;

-- CreateTable
CREATE TABLE `cultureUnity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_local` INTEGER NOT NULL,
    `id_unity_culture` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `name_unity_culture` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cultureUnity_name_unity_culture_key`(`name_unity_culture`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dividers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_quadra` INTEGER NOT NULL,
    `t4_i` INTEGER NOT NULL,
    `t4_f` INTEGER NOT NULL,
    `di` INTEGER NOT NULL,
    `divisor` INTEGER NOT NULL,
    `df` INTEGER NOT NULL,
    `sem_metros` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `envelope` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_type_assay` INTEGER NOT NULL,
    `seeds` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_import` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `table` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 2,
    `executeTime` VARCHAR(191) NULL,
    `totalRecords` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assay_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_foco` INTEGER NOT NULL,
    `id_type_assay` INTEGER NOT NULL,
    `id_tecnologia` INTEGER NOT NULL,
    `gli` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `protocol_name` VARCHAR(191) NOT NULL,
    `bgm` INTEGER NOT NULL,
    `project` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'IMPORTADO',
    `comments` VARCHAR(191) NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genotype_treatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_assay_list` INTEGER NOT NULL,
    `id_genotipo` INTEGER NOT NULL,
    `id_lote` INTEGER NULL,
    `treatments_number` INTEGER NOT NULL,
    `comments` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_genotype_treatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gli` VARCHAR(191) NOT NULL,
    `safra` VARCHAR(191) NOT NULL,
    `foco` VARCHAR(191) NOT NULL,
    `ensaio` VARCHAR(191) NOT NULL,
    `tecnologia` INTEGER NOT NULL,
    `bgm` INTEGER NOT NULL,
    `nt` INTEGER NOT NULL,
    `genotipo` VARCHAR(191) NOT NULL,
    `nca` DECIMAL(12, 0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cultureUnity` ADD CONSTRAINT `cultureUnity_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quadra` ADD CONSTRAINT `quadra_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dividers` ADD CONSTRAINT `dividers_id_quadra_fkey` FOREIGN KEY (`id_quadra`) REFERENCES `quadra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `envelope` ADD CONSTRAINT `envelope_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `envelope` ADD CONSTRAINT `envelope_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_idSafra_fkey` FOREIGN KEY (`idSafra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_idLocal_fkey` FOREIGN KEY (`idLocal`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_idDelineamento_fkey` FOREIGN KEY (`idDelineamento`) REFERENCES `delineamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiment` ADD CONSTRAINT `experiment_idAssayList_fkey` FOREIGN KEY (`idAssayList`) REFERENCES `assay_list`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_import` ADD CONSTRAINT `log_import_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assay_list` ADD CONSTRAINT `assay_list_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assay_list` ADD CONSTRAINT `assay_list_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assay_list` ADD CONSTRAINT `assay_list_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assay_list` ADD CONSTRAINT `assay_list_id_tecnologia_fkey` FOREIGN KEY (`id_tecnologia`) REFERENCES `tecnologia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genotype_treatment` ADD CONSTRAINT `genotype_treatment_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genotype_treatment` ADD CONSTRAINT `genotype_treatment_id_genotipo_fkey` FOREIGN KEY (`id_genotipo`) REFERENCES `genotipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genotype_treatment` ADD CONSTRAINT `genotype_treatment_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `lote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genotype_treatment` ADD CONSTRAINT `genotype_treatment_id_assay_list_fkey` FOREIGN KEY (`id_assay_list`) REFERENCES `assay_list`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
