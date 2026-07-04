-- AlterTable: tambah kolom role untuk membedakan owner/admin
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'owner';

-- CreateIndex: username harus unik agar bisa dipakai login
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
