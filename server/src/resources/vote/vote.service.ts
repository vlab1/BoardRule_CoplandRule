import { Prisma } from '@/utils/prisma/prisma';
import { Vote } from '@prisma/client';
import generateRandomNumber from '@/utils/functions/generateRandomNumber';

class VoteService {
    private vote = Prisma.getPrisma().vote;
    private voter = Prisma.getPrisma().voter;
    private candidate = Prisma.getPrisma().candidate;

    public async get(): Promise<Array<Vote> | Error> {
        try {
            const votes = await this.vote.findMany({
                include: {
                    voter: true,
                    candidate: true,
                },
            });
            return votes;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async create(
        candidateId: number,
        voterId: number,
        place: number
    ): Promise<Vote | Error> {
        try {
            const vote = await this.vote.create({
                data: {
                    candidateId,
                    voterId,
                    place,
                },
            });
            return vote;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        candidateId: number,
        voterId: number,
        place: number
    ): Promise<Vote | Error> {
        try {
            const vote = await this.vote.update({
                where: {
                    candidateId_voterId: {
                        candidateId: candidateId,
                        voterId: voterId,
                    },
                },
                data: {
                    candidateId,
                    voterId,
                    place,
                },
            });
            return vote;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(
        candidateId: number,
        voterId: number
    ): Promise<Vote | Error> {
        try {
            const vote = await this.vote.delete({
                where: {
                    candidateId_voterId: {
                        candidateId: candidateId,
                        voterId: voterId,
                    },
                },
            });
            return vote;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(
        candidateId: number,
        voterId: number,
        place: number
    ): Promise<Array<Vote> | Error> {
        try {
            const votes = await this.vote.findMany({
                where: { voterId, candidateId, place },
                include: {
                    voter: true,
                    candidate: true,
                },
            });
            return votes;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async generate(): Promise<Number | Error> {
        try {
            await this.vote.deleteMany({});
            const voters = await this.voter.findMany({});
            const candidates = await this.candidate.findMany({});
            const input = [];
            for (let i = 0; i < voters.length; i++) {
                let randomNumber = generateRandomNumber(1, candidates.length);
                for (let j = 0; j < candidates.length; j++) {
                    input.push({
                        place: randomNumber,
                        candidateId: candidates[j].id,
                        voterId: voters[i].id,
                    });
                    randomNumber += 1;
                    if (randomNumber > candidates.length) {
                        randomNumber = 1;
                    }
                }
            }
            const votes = await this.vote.createMany({
                data: input,
            });

            return votes.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async destroy(): Promise<Number | Error> {
        try {
            const destroy = await this.vote.deleteMany({});
            return destroy.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async boardRule(): Promise<
        | {
              boardRuleSolve: Record<string, number>;
              boardRuleCounting: Record<string, number>;
              boardRuleCountingSteps: Record<string, string>;
          }
        | Error
    > {
        try {
            const voters = await this.voter.findMany({
                include: { votes: { include: { candidate: true } } },
            });

            const groupedVoters: Record<string, typeof voters> = {};

            voters.forEach((voter) => {
                const voteKey = voter.votes
                    .sort((a, b) => a.place - b.place)
                    .map((vote) => vote.candidate.name)
                    .join(',');

                if (!groupedVoters[voteKey]) {
                    groupedVoters[voteKey] = [];
                }

                groupedVoters[voteKey].push(voter);
            });
            const votersVoted = [] as Array<Array<string>>;
            const votersVotedCount = [] as Array<number>;
            for (let key in groupedVoters) {
                votersVoted.push(key.split(','));
                votersVotedCount.push(groupedVoters[key].length);
            }
            const boardRuleCounting: Record<string, number> = {};
            const boardRuleCountingSteps: Record<string, string> = {};
            const boardRuleSolve: Record<string, number> = {};
            const maxPoints = votersVotedCount.length - 1;
            for (let i = 0; i < votersVoted.length; i++) {
                let points = maxPoints;
                for (let j = 0; j < votersVoted[i].length; j++) {
                    if (!boardRuleCounting[votersVoted[i][j]]) {
                        boardRuleCounting[votersVoted[i][j]] = 0;
                    }
                    if (!boardRuleCountingSteps[votersVoted[i][j]]) {
                        boardRuleCountingSteps[votersVoted[i][j]] = ``;
                    }
                    boardRuleCounting[votersVoted[i][j]] +=
                        votersVotedCount[i] * points;
                    boardRuleCountingSteps[
                        votersVoted[i][j]
                    ] += `${votersVotedCount[i]} ⋅ ${points} + `;
                    points--;
                }
            }
            for (let key in boardRuleCountingSteps) {
                boardRuleCountingSteps[key] = boardRuleCountingSteps[
                    key
                ].replace(/\s\+\s$/, '');
            }
            const maxCount = Math.max(...Object.values(boardRuleCounting));

            const maxKeys = Object.keys(boardRuleCounting).filter(
                (key) => boardRuleCounting[key] === maxCount
            );
            maxKeys.forEach((key) => {
                boardRuleSolve[key] = maxCount;
            });
            return {
                boardRuleSolve,
                boardRuleCounting,
                boardRuleCountingSteps,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async coplandRule(): Promise<
        | {
              coplandRuleSolve: Record<string, number>;
              coplandRuleCounting: Record<string, number>;
              coplandRuleCountingSteps: Array<string>;
          }
        | Error
    > {
        try {
            const voters = await this.voter.findMany({
                include: { votes: { include: { candidate: true } } },
            });

            const groupedVoters: Record<string, typeof voters> = {};

            voters.forEach((voter) => {
                const voteKey = voter.votes
                    .sort((a, b) => a.place - b.place)
                    .map((vote) => vote.candidate.name)
                    .join(',');

                if (!groupedVoters[voteKey]) {
                    groupedVoters[voteKey] = [];
                }

                groupedVoters[voteKey].push(voter);
            });
            const votersVoted = [] as Array<Array<string>>;
            const votersVotedCount = [] as Array<number>;
            for (let key in groupedVoters) {
                votersVoted.push(key.split(','));
                votersVotedCount.push(groupedVoters[key].length);
            }

            const candidates = [...new Set(votersVoted.flat())];
            const coplandRuleSteps: Record<string, Array<string>> = {};
            for (let i = 0; i < candidates.length; i++) {
                const candidate = candidates[i];
                for (let j = 0; j < votersVoted.length; j++) {
                    for (let k = 0; k < votersVoted[j].length; k++) {
                        if (!coplandRuleSteps[votersVoted[i][j]]) {
                            coplandRuleSteps[votersVoted[i][j]] = [];
                        }
                        if (votersVoted[j][k] !== candidate) {
                            if (
                                votersVoted[j].indexOf(candidate) <
                                votersVoted[j].indexOf(votersVoted[j][k])
                            ) {
                                coplandRuleSteps[candidate].push(
                                    `${candidate} > ${votersVoted[j][k]} = ${
                                        votersVotedCount[j]
                                    }:${0}`
                                );
                            } else {
                                coplandRuleSteps[candidate].push(
                                    `${candidate} < ${
                                        votersVoted[j][k]
                                    } = ${0}:${votersVotedCount[j]}`
                                );
                            }
                        }
                    }
                }
            }
            function transformData(
                data: Record<string, string[]>
            ): Record<string, Array<number>> {
                const dataOpponent: Record<string, Array<number>> = {};
                for (const candidate in data) {
                    for (const match of data[candidate]) {
                        const [opponentsComparison, score] = match.split(' = ');
                        const [leftScore, rightScore] = score
                            .split(':')
                            .map(Number);
                        if (opponentsComparison.indexOf(' > ') >= 0) {
                            const [opponent1, opponent2] =
                                opponentsComparison.split(' > ');
                            if (!dataOpponent[`${opponent1} & ${opponent2}`]) {
                                dataOpponent[`${opponent1} & ${opponent2}`] = [
                                    0, 0,
                                ];
                            }
                            dataOpponent[`${opponent1} & ${opponent2}`][0] +=
                                leftScore;
                        }
                        if (opponentsComparison.indexOf(' < ') >= 0) {
                            const [opponent1, opponent2] =
                                opponentsComparison.split(' < ');
                            if (!dataOpponent[`${opponent1} & ${opponent2}`]) {
                                dataOpponent[`${opponent1} & ${opponent2}`] = [
                                    0, 0,
                                ];
                            }

                            dataOpponent[`${opponent1} & ${opponent2}`][1] +=
                                rightScore;
                        }
                    }
                }
                return dataOpponent;
            }
            let transformCoplandRuleSteps = transformData(coplandRuleSteps);
            for (const firstItem in transformCoplandRuleSteps) {
                const [opponent01, opponent02] = firstItem.split(' & ');
                for (const secondItem in transformCoplandRuleSteps) {
                    const [opponent11, opponent22] = secondItem.split(' & ');
                    if (
                        firstItem !== secondItem &&
                        opponent01 === opponent22 &&
                        opponent02 === opponent11
                    ) {
                        delete transformCoplandRuleSteps[secondItem];
                    }
                }
            }
            const coplandRuleCountingSteps = [] as Array<string>;
            const coplandRuleCounting = {} as Record<string, number>;
            const coplandRuleSolve = {} as Record<string, number>;
            for (const item in transformCoplandRuleSteps) {
                const [opponent1, opponent2] = item.split(' & ');
                if (!coplandRuleCounting[opponent1]) {
                    coplandRuleCounting[opponent1] = 0;
                }
                if (!coplandRuleCounting[opponent2]) {
                    coplandRuleCounting[opponent2] = 0;
                }
                if (
                    transformCoplandRuleSteps[item][0] >
                    transformCoplandRuleSteps[item][1]
                ) {
                    coplandRuleCountingSteps.push(
                        `${opponent1} > ${opponent2} = ${transformCoplandRuleSteps[item][0]} : ${transformCoplandRuleSteps[item][1]}`
                    );
                    coplandRuleCounting[opponent1] += 1;
                    coplandRuleCounting[opponent2] -= 1;
                } else if (
                    transformCoplandRuleSteps[item][0] <
                    transformCoplandRuleSteps[item][1]
                )  {
                    coplandRuleCountingSteps.push(
                        `${opponent1} < ${opponent2} = ${transformCoplandRuleSteps[item][0]} : ${transformCoplandRuleSteps[item][1]}`
                    );
                    coplandRuleCounting[opponent1] -= 1;
                    coplandRuleCounting[opponent2] += 1;
                }
            }
            const maxCount = Math.max(...Object.values(coplandRuleCounting));

            const maxKeys = Object.keys(coplandRuleCounting).filter(
                (key) => coplandRuleCounting[key] === maxCount
            );
            maxKeys.forEach((key) => {
                coplandRuleSolve[key] = maxCount;
            });
            return {
                coplandRuleSolve,
                coplandRuleCountingSteps,
                coplandRuleCounting,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async tableBoardRule(): Promise<Array<Array<string>> | Error> {
        try {
            const count = await this.vote.count();
            if (count <= 0) {
                throw new Error('The vote table should have records');
            }

            const voters = await this.voter.findMany({
                include: { votes: { include: { candidate: true } } },
            });

            const groupedVoters: Record<string, typeof voters> = {};

            voters.forEach((voter) => {
                const voteKey = voter.votes
                    .sort((a, b) => a.place - b.place)
                    .map((vote) => vote.candidate.name)
                    .join(',');

                if (!groupedVoters[voteKey]) {
                    groupedVoters[voteKey] = [];
                }

                groupedVoters[voteKey].push(voter);
            });
            const votersVoted = [] as Array<Array<string>>;
            const votersVotedCount = [] as Array<number>;
            for (let key in groupedVoters) {
                votersVoted.push(key.split(','));
                votersVotedCount.push(groupedVoters[key].length);
            }
            const votersVotedTable = [] as Array<Array<string>>;
            for (let i = 0; i < votersVoted.length; i++) {
                const temp = [] as Array<string>;
                for (let j = 0; j < votersVoted.length; j++) {
                    temp.push(votersVoted[j][i]);
                }
                votersVotedTable.push(temp);
            }
            votersVotedTable.unshift(votersVotedCount.map((item) => item + ''));
            for (
                let i = 0, j = votersVotedTable.length - 1;
                i < votersVotedTable.length;
                i++, j--
            ) {
                if (i === 0) {
                    votersVotedTable[i].push('Points');
                } else {
                    votersVotedTable[i].push(j + '');
                }
            }
            return votersVotedTable;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async tableCoplandRule(): Promise<Array<Array<string>> | Error> {
        try {
            const count = await this.vote.count();
            if (count <= 0) {
                throw new Error('The vote table should have records');
            }

            const voters = await this.voter.findMany({
                include: { votes: { include: { candidate: true } } },
            });

            const groupedVoters: Record<string, typeof voters> = {};

            voters.forEach((voter) => {
                const voteKey = voter.votes
                    .sort((a, b) => a.place - b.place)
                    .map((vote) => vote.candidate.name)
                    .join(',');

                if (!groupedVoters[voteKey]) {
                    groupedVoters[voteKey] = [];
                }

                groupedVoters[voteKey].push(voter);
            });
            const votersVoted = [] as Array<Array<string>>;
            const votersVotedCount = [] as Array<number>;
            for (let key in groupedVoters) {
                votersVoted.push(key.split(','));
                votersVotedCount.push(groupedVoters[key].length);
            }
            const votersVotedTable = [] as Array<Array<string>>;
            for (let i = 0; i < votersVoted.length; i++) {
                const temp = [] as Array<string>;
                for (let j = 0; j < votersVoted.length; j++) {
                    temp.push(votersVoted[j][i]);
                }
                votersVotedTable.push(temp);
            }
            votersVotedTable.unshift(votersVotedCount.map((item) => item + ''));

            return votersVotedTable;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createMany(votes: Array<Vote>): Promise<Number | Error> {
        try {
            const count = await this.candidate.count();
            if (votes.length !== count) {
                throw new Error('You must vote for all candidates');
            }
            const vote = await this.vote.createMany({
                data: votes,
            });
            return vote.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default VoteService;
