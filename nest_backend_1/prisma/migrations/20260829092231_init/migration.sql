/*
  Warnings:

  - Added the required column `passwordHashed` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHashed" TEXT NOT NULL;
