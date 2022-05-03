-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_ogm_fkey` FOREIGN KEY (`id_ogm`) REFERENCES `ogm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_epoca_fkey` FOREIGN KEY (`id_epoca`) REFERENCES `epoca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
