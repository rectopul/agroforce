-- CreateTable
CREATE TABLE `semaforo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_edit_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `sessao` VARCHAR(191) NOT NULL,
    `acao` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `automatico` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `semaforoItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_edit_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `referencia` VARCHAR(191) NOT NULL,
    `codReferencia` VARCHAR(191) NOT NULL,
    `semaforoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `semaforoItem` ADD CONSTRAINT `semaforoItem_semaforoId_fkey` FOREIGN KEY (`semaforoId`) REFERENCES `semaforo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
