-- DropForeignKey
ALTER TABLE `experiment_genotipe` DROP FOREIGN KEY `experiment_genotipe_idGenotipo_fkey`;

-- AlterTable
ALTER TABLE `experiment_genotipe` MODIFY `idGenotipo` INTEGER NULL,
    MODIFY `nca` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `genotipo` ADD COLUMN `dt_import` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `lote` MODIFY `dt_import` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idGenotipo_fkey` FOREIGN KEY (`idGenotipo`) REFERENCES `genotipo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
