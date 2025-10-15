-- AlterTable
ALTER TABLE `payments` ADD COLUMN `qrValidated` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `employee_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `qrToken` VARCHAR(191) NOT NULL,
    `qrCodePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employee_profiles_employeeId_key`(`employeeId`),
    UNIQUE INDEX `employee_profiles_qrToken_key`(`qrToken`),
    INDEX `employee_profiles_employeeId_idx`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee_profiles` ADD CONSTRAINT `employee_profiles_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
