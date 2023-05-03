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
class CandidateService {
    constructor() {
        this.candidate = prisma_1.Prisma.getPrisma().candidate;
        this.vote = prisma_1.Prisma.getPrisma().vote;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield this.candidate.findMany({
                    include: {
                        votes: true,
                    },
                });
                return candidates;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    create(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRecord = yield this.candidate.findFirst({ where: {
                        name
                    } });
                if (existingRecord) {
                    throw new Error("The candidate is already registered");
                }
                const candidate = yield this.candidate.create({
                    data: {
                        name,
                        description,
                    },
                });
                yield this.vote.deleteMany({});
                return candidate;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createMany(candidates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield this.candidate.createMany({
                    data: candidates
                });
                return candidate.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield this.candidate.update({
                    where: { id },
                    data: {
                        name,
                        description,
                    },
                });
                return candidate;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield this.candidate.delete({
                    where: { id },
                });
                return candidate;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const destroy = yield this.candidate.deleteMany({});
                return destroy.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield this.candidate.findMany({
                    where: { id, name, description },
                    include: {
                        votes: true,
                    },
                });
                return candidates;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    generate(count) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.candidate.deleteMany({});
                yield this.vote.deleteMany({});
                const input = [];
                for (let i = 1; i < count + 1; i++) {
                    input.push({
                        name: `Candidate_${i}`,
                    });
                }
                const candidates = yield this.candidate.createMany({
                    data: input,
                });
                return candidates.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = CandidateService;
