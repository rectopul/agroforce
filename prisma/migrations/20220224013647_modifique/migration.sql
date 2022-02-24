-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_id_profile_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `id_profile` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_id_profile_fkey` FOREIGN KEY (`id_profile`) REFERENCES `Profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
