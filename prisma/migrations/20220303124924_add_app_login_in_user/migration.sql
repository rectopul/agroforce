-- AlterTable
ALTER TABLE `user` ADD COLUMN `app_login` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Safra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ano` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Safra_ano_key`(`ano`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
