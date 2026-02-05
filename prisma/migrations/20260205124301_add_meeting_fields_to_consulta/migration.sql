-- AlterTable
ALTER TABLE "consultas" ADD COLUMN     "meetingDate" TIMESTAMP(3),
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "meetingRequestedBy" "UserRole",
ADD COLUMN     "meetingStatus" "MeetingStatus" NOT NULL DEFAULT 'PENDING';
