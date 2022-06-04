/*
  Warnings:

  - You are about to drop the column `group` on the `foco` table. All the data in the column will be lost.
  - You are about to drop the `layoult_quadra` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `layoult_quadra` DROP FOREIGN KEY `layoult_quadra_localId_fkey`;

-- AlterTable
ALTER TABLE `foco` DROP COLUMN `group`;

-- AlterTable
ALTER TABLE `npe` ADD COLUMN `group` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `safra` MODIFY `safraName` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `layoult_quadra`;

-- CreateTable
CREATE TABLE `layout_quadra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `esquema` VARCHAR(191) NOT NULL,
    `plantadeira` VARCHAR(191) NOT NULL,
    `tiros` INTEGER NULL,
    `disparos` INTEGER NULL,
    `parcelas` INTEGER NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `layout_children` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_layout` INTEGER NOT NULL,
    `sl` INTEGER NOT NULL,
    `sc` INTEGER NOT NULL,
    `s_aloc` INTEGER NOT NULL,
    `tiro` INTEGER NOT NULL,
    `cj` VARCHAR(191) NOT NULL,
    `disparo` INTEGER NOT NULL,
    `dist` INTEGER NOT NULL,
    `st` VARCHAR(191) NOT NULL,
    `spc` VARCHAR(191) NOT NULL,
    `scolheita` INTEGER NOT NULL,
    `tipo_parcela` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quadra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_quadra` VARCHAR(191) NOT NULL,
    `id_culture` INTEGER NOT NULL,
    `id_safra` INTEGER NOT NULL,
    `local_preparo` INTEGER NOT NULL,
    `local_plantio` VARCHAR(191) NULL,
    `larg_q` INTEGER NOT NULL,
    `comp_p` INTEGER NOT NULL,
    `linha_p` INTEGER NOT NULL,
    `comp_c` INTEGER NOT NULL,
    `esquema` VARCHAR(191) NULL,
    `tiro_fixo` VARCHAR(191) NULL,
    `disparo_fixo` VARCHAR(191) NULL,
    `q` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disparos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_quadra` INTEGER NOT NULL,
    `t4_i` INTEGER NOT NULL,
    `t4_f` INTEGER NOT NULL,
    `di` INTEGER NOT NULL,
    `divisor` INTEGER NOT NULL,
    `df` INTEGER NOT NULL,
    `sem_metros` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foco_children` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_foco` INTEGER NOT NULL,
    `grupo` INTEGER NOT NULL,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `layout_quadra` ADD CONSTRAINT `layout_quadra_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `layout_children` ADD CONSTRAINT `layout_children_id_layout_fkey` FOREIGN KEY (`id_layout`) REFERENCES `layout_quadra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quadra` ADD CONSTRAINT `quadra_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quadra` ADD CONSTRAINT `quadra_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quadra` ADD CONSTRAINT `quadra_local_preparo_fkey` FOREIGN KEY (`local_preparo`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disparos` ADD CONSTRAINT `disparos_id_quadra_fkey` FOREIGN KEY (`id_quadra`) REFERENCES `quadra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foco_children` ADD CONSTRAINT `foco_children_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foco_children` ADD CONSTRAINT `foco_children_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
