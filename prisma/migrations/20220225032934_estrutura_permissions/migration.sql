/*
  Warnings:

  - You are about to drop the column `id_profile` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `cultura` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_at` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_id_profile_fkey`;

-- AlterTable
ALTER TABLE `profile` ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `status` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `id_profile`,
    DROP COLUMN `telefone`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL,
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `tel` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `cultura`;

-- CreateTable
CREATE TABLE `Users_Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Culture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users_Permissions` ADD CONSTRAINT `Users_Permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
