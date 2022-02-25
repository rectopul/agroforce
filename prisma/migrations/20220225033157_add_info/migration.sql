/*
  Warnings:

  - Added the required column `profileId` to the `Users_Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users_permissions` ADD COLUMN `profileId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Users_Permissions` ADD CONSTRAINT `Users_Permissions_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
