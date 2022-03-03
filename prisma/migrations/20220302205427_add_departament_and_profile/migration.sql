/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Culture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departamentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `departamentId` INTEGER NOT NULL,
    ADD COLUMN `jivochat` INTEGER NULL DEFAULT 0,
    ADD COLUMN `registration` INTEGER NULL;

-- CreateTable
CREATE TABLE `Departament` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Departament_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Culture_name_key` ON `Culture`(`name`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departamentId_fkey` FOREIGN KEY (`departamentId`) REFERENCES `Departament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
