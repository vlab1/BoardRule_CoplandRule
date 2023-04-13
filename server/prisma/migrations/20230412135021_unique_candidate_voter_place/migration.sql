/*
  Warnings:

  - A unique constraint covering the columns `[candidateId,voterId,place]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_candidateId_voterId_place_key" ON "Vote"("candidateId", "voterId", "place");
