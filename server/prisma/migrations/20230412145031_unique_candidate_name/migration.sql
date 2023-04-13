/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Candidate_name_key" ON "Candidate"("name");
