-- AlterTable: add name and image fields required by NextAuth PrismaAdapter for OAuth providers
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
