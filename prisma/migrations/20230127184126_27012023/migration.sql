/*
  Warnings:

  - A unique constraint covering the columns `[name_local_culture]` on the table `local` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `local_name_local_culture_key` ON `local`(`name_local_culture`);
