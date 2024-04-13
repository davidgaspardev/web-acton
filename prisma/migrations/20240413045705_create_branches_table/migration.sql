-- AlterTable
ALTER TABLE `Users` ADD COLUMN `brancheId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS `Branches` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `latitude` DECIMAL(10, 6) NOT NULL,
    `longitude` DECIMAL(10, 6) NOT NULL,
    `evoDns` VARCHAR(64) NOT NULL,
    `evoToken` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Users_brancheId_fkey` ON `Users`(`brancheId`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_brancheId_fkey` FOREIGN KEY (`brancheId`) REFERENCES `Branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
