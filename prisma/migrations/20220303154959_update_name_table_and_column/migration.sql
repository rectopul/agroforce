/*
  Warnings:

  - You are about to drop the column `departamentId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `departament` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departmentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_departamentId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `departamentId`,
    ADD COLUMN `departmentId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `departament`;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
