/*
  Warnings:

  - You are about to drop the column `profileImage` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employees` DROP COLUMN `profileImage`,
    ADD COLUMN `photos` VARCHAR(191) NULL;
