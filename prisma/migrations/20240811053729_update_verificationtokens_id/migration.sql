/*
  Warnings:

  - The primary key for the `verificationtokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[identifier]` on the table `verificationtokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "verificationtokens" DROP CONSTRAINT "verificationtokens_pkey",
ADD CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_key" ON "verificationtokens"("identifier");
