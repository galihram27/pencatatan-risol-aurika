-- AlterTable: hapus kolom role karena aplikasi single-owner tanpa pembeda hak akses
ALTER TABLE "User" DROP COLUMN "role";
