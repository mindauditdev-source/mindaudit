/*
  Warnings:

  - You are about to drop the column `dismissedPartnerPlanModal` on the `colaboradores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "colaboradores" DROP COLUMN "dismissedPartnerPlanModal";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dismissedPartnerPlanModal" BOOLEAN NOT NULL DEFAULT false;
