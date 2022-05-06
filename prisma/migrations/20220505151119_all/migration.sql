-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL,
    `ufid` INTEGER NOT NULL,
    `nome` CHAR(255) NULL,

    INDEX `ufid`(`ufid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config_gerais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itens_per_page` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `culture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Culture_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Modules_module_key`(`module`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `acess_permission` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `safra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `typeCrop` VARCHAR(191) NOT NULL,
    `plantingStartTime` VARCHAR(191) NOT NULL,
    `plantingEndTime` VARCHAR(191) NOT NULL,
    `main_safra` INTEGER NULL DEFAULT 0,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `uf` (
    `id` INTEGER NOT NULL,
    `nome` CHAR(255) NULL,
    `sigla` CHAR(2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` TEXT NULL,
    `registration` INTEGER NULL,
    `departmentId` INTEGER NOT NULL,
    `jivochat` INTEGER NULL DEFAULT 0,
    `app_login` INTEGER NULL DEFAULT 1,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    INDEX `User_departmentId_fkey`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_cultures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cultureId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,

    INDEX `Users_Cultures_cultureId_fkey`(`cultureId`),
    INDEX `Users_Cultures_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `profileId` INTEGER NOT NULL,
    `cultureId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,

    INDEX `Users_Permissions_profileId_fkey`(`profileId`),
    INDEX `Users_Permissions_cultureId_fkey`(`cultureId`),
    INDEX `Users_Permissions_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_preferences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `module_id` INTEGER NOT NULL,
    `table_preferences` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Users_Preferences_module_id_fkey`(`module_id`),
    INDEX `Users_Preferences_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `local` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `altitude` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `layoult_quadra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `esquema` VARCHAR(191) NOT NULL,
    `op` VARCHAR(191) NOT NULL,
    `semente_metros` INTEGER NOT NULL,
    `disparos` INTEGER NOT NULL,
    `divisor` INTEGER NOT NULL,
    `largura` VARCHAR(191) NOT NULL,
    `comp_fisico` VARCHAR(191) NOT NULL,
    `comp_parcela` VARCHAR(191) NOT NULL,
    `comp_corredor` VARCHAR(191) NOT NULL,
    `t4_inicial` INTEGER NOT NULL,
    `t4_final` INTEGER NOT NULL,
    `df_inicial` INTEGER NOT NULL,
    `df_final` INTEGER NOT NULL,
    `localId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genotipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `genealogy` VARCHAR(191) NOT NULL,
    `cruza` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delineamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `repeticao` INTEGER NOT NULL,
    `trat_repeticao` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` INTEGER NULL,
    `status` INTEGER NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_assay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnologia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_genotipo` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `volume` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `epoca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_culture` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `import_spreadsheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moduleId` INTEGER NOT NULL,
    `fields` JSON NOT NULL,

    UNIQUE INDEX `import_spreadsheet_moduleId_key`(`moduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `npe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_local` INTEGER NOT NULL,
    `id_safra` INTEGER NOT NULL,
    `id_foco` INTEGER NOT NULL,
    `id_type_assay` INTEGER NOT NULL,
    `id_ogm` INTEGER NOT NULL,
    `id_epoca` INTEGER NOT NULL,
    `npei` INTEGER NOT NULL,
    `npef` INTEGER NULL,
    `prox_npe` INTEGER NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sequencia_delineamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_delineamento` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `repeticao` INTEGER NOT NULL,
    `sorteio` INTEGER NOT NULL,
    `nt` INTEGER NOT NULL,
    `bloco` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `safra` ADD CONSTRAINT `safra_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_cultures` ADD CONSTRAINT `Users_Cultures_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_cultures` ADD CONSTRAINT `Users_Cultures_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_permissions` ADD CONSTRAINT `users_permissions_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_permissions` ADD CONSTRAINT `Users_Permissions_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_permissions` ADD CONSTRAINT `Users_Permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_preferences` ADD CONSTRAINT `Users_Preferences_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_preferences` ADD CONSTRAINT `Users_Preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `layoult_quadra` ADD CONSTRAINT `layoult_quadra_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `genotipo` ADD CONSTRAINT `genotipo_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delineamento` ADD CONSTRAINT `delineamento_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foco` ADD CONSTRAINT `foco_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `type_assay` ADD CONSTRAINT `type_assay_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tecnologia` ADD CONSTRAINT `tecnologia_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `lote_id_genotipo_fkey` FOREIGN KEY (`id_genotipo`) REFERENCES `genotipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `epoca` ADD CONSTRAINT `epoca_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_ogm_fkey` FOREIGN KEY (`id_ogm`) REFERENCES `tecnologia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `npe` ADD CONSTRAINT `npe_id_epoca_fkey` FOREIGN KEY (`id_epoca`) REFERENCES `epoca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sequencia_delineamento` ADD CONSTRAINT `sequencia_delineamento_id_delineamento_fkey` FOREIGN KEY (`id_delineamento`) REFERENCES `delineamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
