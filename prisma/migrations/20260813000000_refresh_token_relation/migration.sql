-- Refresh tokens belong to a user and are removed when that user is deleted.
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

ALTER TABLE "RefreshToken"
ADD CONSTRAINT "RefreshToken_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
