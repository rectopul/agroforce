/*
  Warnings:

  - You are about to drop the `assay_type_children` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assay_type_children` DROP FOREIGN KEY `assay_type_children_type_assayId_fkey`;

-- DropTable
DROP TABLE `assay_type_children`;

-- CreateTable
CREATE TABLE `type_assay_children` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_safra` INTEGER NOT NULL,
    `id_type_assay` INTEGER NOT NULL,
    `seeds` INTEGER NOT NULL,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type_assayId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `type_assay_children` ADD CONSTRAINT `type_assay_children_type_assayId_fkey` FOREIGN KEY (`type_assayId`) REFERENCES `type_assay`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
