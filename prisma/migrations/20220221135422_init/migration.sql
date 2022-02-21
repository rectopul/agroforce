/*
  Warnings:

  - You are about to drop the column `teste` on the `user` table. All the data in the column will be lost.
  - Added the required column `token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `teste`,
    ADD COLUMN `token` VARCHAR(191) NOT NULL;
