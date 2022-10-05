-- AddForeignKey
ALTER TABLE `reportes` ADD CONSTRAINT `reportes_madeBy_fkey` FOREIGN KEY (`madeBy`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
