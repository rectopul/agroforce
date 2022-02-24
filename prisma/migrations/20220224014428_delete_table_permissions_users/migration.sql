/*
  Warnings:

  - You are about to drop the `users_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `users_permissions` DROP FOREIGN KEY `Users_Permissions_userId_fkey`;

-- DropTable
DROP TABLE `users_permissions`;
