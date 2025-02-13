-- CreateTable
CREATE TABLE `RolModulePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `moduleId` INTEGER NOT NULL,
    `role` ENUM('ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'STUDENT', 'PARENT', 'WORKER') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RolModulePermission` ADD CONSTRAINT `RolModulePermission_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
