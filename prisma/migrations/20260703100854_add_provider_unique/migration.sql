-- AlterTable
ALTER TABLE "users" ALTER COLUMN "encryptedpassword" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_provider_id_key" ON "users"("provider", "provider_id");
