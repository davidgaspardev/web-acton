-- CreateTable
CREATE TABLE `Admins` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    `password` CHAR(64) NOT NULL,
    `rules` VARCHAR(8) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admins_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(128) NOT NULL,
    `email` VARCHAR(128) NULL,
    `whatsapp` CHAR(11) NOT NULL,
    `gender` ENUM('MASCULINO', 'FEMININO', 'TRANS', 'OUTROS', 'DESCONHECIDO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Results` (
    `id` VARCHAR(191) NOT NULL,
    `methodology` VARCHAR(64) NOT NULL,
    `level` INTEGER NOT NULL,
    `stage` INTEGER NOT NULL,
    `needs` VARCHAR(256) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionCode` VARCHAR(32) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Results_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quizzes` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(256) NOT NULL,
    `answer` VARCHAR(256) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionCode` VARCHAR(32) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Quizzes_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Results` ADD CONSTRAINT `Results_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quizzes` ADD CONSTRAINT `Quizzes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
