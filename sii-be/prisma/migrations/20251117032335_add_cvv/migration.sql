/*
  Warnings:

  - Added the required column `cvv` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardNumber" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_cards" ("cardHolder", "cardNumber", "createdAt", "expiryDate", "id", "updatedAt", "cvv") SELECT "cardHolder", "cardNumber", "createdAt", "expiryDate", "id", "updatedAt", '000' FROM "cards";
DROP TABLE "cards";
ALTER TABLE "new_cards" RENAME TO "cards";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
