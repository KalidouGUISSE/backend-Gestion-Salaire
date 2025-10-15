/*
  Warnings:

  - You are about to drop the column `date` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `hoursWorked` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `attendances` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `attendances` DROP FOREIGN KEY `attendances_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `attendances` DROP FOREIGN KEY `attendances_employeeId_fkey`;

-- DropIndex
DROP INDEX `attendances_companyId_date_idx` ON `attendances`;

-- DropIndex
DROP INDEX `attendances_employeeId_date_idx` ON `attendances`;

-- DropIndex
DROP INDEX `attendances_employeeId_date_key` ON `attendances`;

-- AlterTable
ALTER TABLE `attendances` DROP COLUMN `date`,
    DROP COLUMN `hoursWorked`,
    DROP COLUMN `note`,
    DROP COLUMN `present`,
    ADD COLUMN `deviceId` VARCHAR(191) NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `type` ENUM('ENTRY', 'EXIT') NOT NULL DEFAULT 'ENTRY';

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `attendanceCount` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `attendances_employeeId_timestamp_idx` ON `attendances`(`employeeId`, `timestamp`);

-- CreateIndex
CREATE INDEX `attendances_companyId_timestamp_idx` ON `attendances`(`companyId`, `timestamp`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
