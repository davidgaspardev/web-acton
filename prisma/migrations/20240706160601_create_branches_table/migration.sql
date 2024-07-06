-- AlterTable
ALTER TABLE `Users` ADD COLUMN `branchId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `cnpj` VARCHAR(18) NULL,
    `phone` CHAR(11) NULL,
    `address` VARCHAR(128) NOT NULL,
    `city` VARCHAR(64) NOT NULL,
    `state` CHAR(2) NOT NULL,
    `zipCode` CHAR(9) NOT NULL,
    `neighborhood` VARCHAR(64) NOT NULL,
    `slug` VARCHAR(64) NOT NULL,
    `imageUrl` VARCHAR(256) NOT NULL,
    `latitude` DECIMAL(10, 6) NOT NULL,
    `longitude` DECIMAL(10, 6) NOT NULL,
    `evoId` INTEGER NOT NULL,
    `evoDns` VARCHAR(64) NOT NULL,
    `evoToken` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Users_branchId_fkey` ON `Users`(`branchId`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
