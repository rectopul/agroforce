/*
  Warnings:

  - You are about to drop the column `created_at` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `created_at`,
    DROP COLUMN `created_by`,
    DROP COLUMN `status`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `permissions` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `users_permissions` ADD COLUMN `user_permissionsId` INTEGER NULL;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `screenRoute` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `profileId` INTEGER NOT NULL,
    `cultureId` INTEGER NOT NULL,
    `createdBy` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile_permissions` ADD CONSTRAINT `profile_permissions_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile_permissions` ADD CONSTRAINT `profile_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

