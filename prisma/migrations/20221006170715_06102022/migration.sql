-- AddForeignKey
ALTER TABLE `experiment_genotipe` ADD CONSTRAINT `experiment_genotipe_idLote_fkey` FOREIGN KEY (`idLote`) REFERENCES `lote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
