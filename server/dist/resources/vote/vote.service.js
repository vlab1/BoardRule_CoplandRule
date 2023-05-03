"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@/utils/prisma/prisma");
class VoteService {
    constructor() {
        this.vote = prisma_1.Prisma.getPrisma().vote;
        this.voter = prisma_1.Prisma.getPrisma().voter;
        this.candidate = prisma_1.Prisma.getPrisma().candidate;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const votes = yield this.vote.findMany({
                    include: {
                        voter: true,
                        candidate: true,
                    },
                });
                return votes;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    create(candidateId, voterId, place) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vote = yield this.vote.create({
                    data: {
                        candidateId,
                        voterId,
                        place,
                    },
                });
                return vote;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(candidateId, voterId, place) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vote = yield this.vote.update({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(candidateId, voterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vote = yield this.vote.delete({
                    where: {
                        candidateId_voterId: {
                            candidateId: candidateId,
                            voterId: voterId,
                        },
                    },
                });
                return vote;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find(candidateId, voterId, place) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const votes = yield this.vote.findMany({
                    where: { voterId, candidateId, place },
                    include: {
                        voter: true,
                        candidate: true,
                    },
                });
                return votes;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                function generateRandomNumber(min, max, usedNumbers) {
                    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    if (usedNumbers.includes(randomNumber)) {
                        return generateRandomNumber(min, max, usedNumbers);
                    }
                    usedNumbers.push(randomNumber);
                    return randomNumber;
                }
                yield this.vote.deleteMany({});
                const voters = yield this.voter.findMany({});
                const candidates = yield this.candidate.findMany({});
                const input = [];
                for (let i = 0; i < voters.length; i++) {
                    const usedNumbers = [];
                    for (let j = 0; j < candidates.length; j++) {
                        const randomNumber = generateRandomNumber(1, candidates.length, usedNumbers);
                        input.push({
                            place: randomNumber,
                            candidateId: candidates[j].id,
                            voterId: voters[i].id,
                        });
                    }
                }
                const votes = yield this.vote.createMany({
                    data: input,
                });
                return votes.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const destroy = yield this.vote.deleteMany({});
                return destroy.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    boardRule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voters = yield this.voter.findMany({
                    include: { votes: { include: { candidate: true } } },
                });
                const groupedVoters = {};
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
                const votersVoted = [];
                const votersVotedCount = [];
                for (let key in groupedVoters) {
                    votersVoted.push(key.split(','));
                    votersVotedCount.push(groupedVoters[key].length);
                }
                const boardRuleCounting = {};
                const boardRuleCountingSteps = {};
                const boardRuleSolve = {};
                const maxPoints = votersVoted[0].length - 1;
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
                        boardRuleCountingSteps[votersVoted[i][j]] += `${votersVotedCount[i]} ⋅ ${points} + `;
                        points--;
                    }
                }
                for (let key in boardRuleCountingSteps) {
                    boardRuleCountingSteps[key] = boardRuleCountingSteps[key].replace(/\s\+\s$/, '');
                }
                const maxCount = Math.max(...Object.values(boardRuleCounting));
                const maxKeys = Object.keys(boardRuleCounting).filter((key) => boardRuleCounting[key] === maxCount);
                maxKeys.forEach((key) => {
                    boardRuleSolve[key] = maxCount;
                });
                return {
                    boardRuleSolve,
                    boardRuleCounting,
                    boardRuleCountingSteps,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    coplandRule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voters = yield this.voter.findMany({
                    include: { votes: { include: { candidate: true } } },
                });
                const groupedVoters = {};
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
                const votersVoted = [];
                const votersVotedCount = [];
                for (let key in groupedVoters) {
                    votersVoted.push(key.split(','));
                    votersVotedCount.push(groupedVoters[key].length);
                }
                const candidates = [...new Set(votersVoted.flat())];
                const coplandRuleSteps = {};
                for (let i = 0; i < candidates.length; i++) {
                    const candidate = candidates[i];
                    for (let j = 0; j < votersVoted.length; j++) {
                        for (let k = 0; k < votersVoted[j].length; k++) {
                            if (!coplandRuleSteps[votersVoted[i][j]]) {
                                coplandRuleSteps[votersVoted[i][j]] = [];
                            }
                            if (votersVoted[j][k] !== candidate) {
                                if (votersVoted[j].indexOf(candidate) <
                                    votersVoted[j].indexOf(votersVoted[j][k])) {
                                    coplandRuleSteps[candidate].push(`${candidate} > ${votersVoted[j][k]} = ${votersVotedCount[j]}:${0}`);
                                }
                                else {
                                    coplandRuleSteps[candidate].push(`${candidate} < ${votersVoted[j][k]} = ${0}:${votersVotedCount[j]}`);
                                }
                            }
                        }
                    }
                }
                function transformData(data) {
                    const dataOpponent = {};
                    for (const candidate in data) {
                        for (const match of data[candidate]) {
                            const [opponentsComparison, score] = match.split(' = ');
                            const [leftScore, rightScore] = score
                                .split(':')
                                .map(Number);
                            if (opponentsComparison.indexOf(' > ') >= 0) {
                                const [opponent1, opponent2] = opponentsComparison.split(' > ');
                                if (!dataOpponent[`${opponent1} & ${opponent2}`]) {
                                    dataOpponent[`${opponent1} & ${opponent2}`] = [
                                        0, 0,
                                    ];
                                }
                                dataOpponent[`${opponent1} & ${opponent2}`][0] +=
                                    leftScore;
                            }
                            if (opponentsComparison.indexOf(' < ') >= 0) {
                                const [opponent1, opponent2] = opponentsComparison.split(' < ');
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
                        if (firstItem !== secondItem &&
                            opponent01 === opponent22 &&
                            opponent02 === opponent11) {
                            delete transformCoplandRuleSteps[secondItem];
                        }
                    }
                }
                const coplandRuleCountingSteps = [];
                const coplandRuleCounting = {};
                const coplandRuleSolve = {};
                for (const item in transformCoplandRuleSteps) {
                    const [opponent1, opponent2] = item.split(' & ');
                    if (!coplandRuleCounting[opponent1]) {
                        coplandRuleCounting[opponent1] = 0;
                    }
                    if (!coplandRuleCounting[opponent2]) {
                        coplandRuleCounting[opponent2] = 0;
                    }
                    if (transformCoplandRuleSteps[item][0] >
                        transformCoplandRuleSteps[item][1]) {
                        coplandRuleCountingSteps.push(`${opponent1} > ${opponent2} = ${transformCoplandRuleSteps[item][0]} : ${transformCoplandRuleSteps[item][1]}`);
                        coplandRuleCounting[opponent1] += 1;
                        coplandRuleCounting[opponent2] -= 1;
                    }
                    else if (transformCoplandRuleSteps[item][0] <
                        transformCoplandRuleSteps[item][1]) {
                        coplandRuleCountingSteps.push(`${opponent1} < ${opponent2} = ${transformCoplandRuleSteps[item][0]} : ${transformCoplandRuleSteps[item][1]}`);
                        coplandRuleCounting[opponent1] -= 1;
                        coplandRuleCounting[opponent2] += 1;
                    }
                }
                const maxCount = Math.max(...Object.values(coplandRuleCounting));
                const maxKeys = Object.keys(coplandRuleCounting).filter((key) => coplandRuleCounting[key] === maxCount);
                maxKeys.forEach((key) => {
                    coplandRuleSolve[key] = maxCount;
                });
                return {
                    coplandRuleSolve,
                    coplandRuleCountingSteps,
                    coplandRuleCounting,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    tableBoardRule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.vote.count();
                if (count <= 0) {
                    throw new Error('The vote table should have records');
                }
                const voters = yield this.voter.findMany({
                    include: { votes: { include: { candidate: true } } },
                });
                const groupedVoters = {};
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
                const votersVoted = [];
                const votersVotedCount = [];
                for (let key in groupedVoters) {
                    votersVoted.push(key.split(','));
                    votersVotedCount.push(groupedVoters[key].length);
                }
                const votersVotedTable = [];
                for (let i = 0; i < votersVoted[0].length; i++) {
                    const temp = [];
                    for (let j = 0; j < votersVoted.length; j++) {
                        temp.push(votersVoted[j][i]);
                    }
                    votersVotedTable.push(temp);
                }
                votersVotedTable.unshift(votersVotedCount.map((item) => item + ''));
                for (let i = 0, j = votersVotedTable.length - 1; i < votersVotedTable.length; i++, j--) {
                    if (i === 0) {
                        votersVotedTable[i].push('Points');
                    }
                    else {
                        votersVotedTable[i].push(j + '');
                    }
                }
                return votersVotedTable;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    tableCoplandRule() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.vote.count();
                if (count <= 0) {
                    throw new Error('The vote table should have records');
                }
                const voters = yield this.voter.findMany({
                    include: { votes: { include: { candidate: true } } },
                });
                const groupedVoters = {};
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
                const votersVoted = [];
                const votersVotedCount = [];
                for (let key in groupedVoters) {
                    votersVoted.push(key.split(','));
                    votersVotedCount.push(groupedVoters[key].length);
                }
                const votersVotedTable = [];
                for (let i = 0; i < votersVoted[0].length; i++) {
                    const temp = [];
                    for (let j = 0; j < votersVoted.length; j++) {
                        temp.push(votersVoted[j][i]);
                    }
                    votersVotedTable.push(temp);
                }
                votersVotedTable.unshift(votersVotedCount.map((item) => item + ''));
                return votersVotedTable;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createMany(votes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.candidate.count();
                if (votes.length !== count) {
                    throw new Error('You must vote for all candidates');
                }
                const vote = yield this.vote.createMany({
                    data: votes,
                });
                return vote.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = VoteService;
