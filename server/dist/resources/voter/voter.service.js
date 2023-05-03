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
class VoterService {
    constructor() {
        this.voter = prisma_1.Prisma.getPrisma().voter;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voters = yield this.voter.findMany({
                    include: {
                        votes: true,
                    },
                });
                return voters;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    create(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRecord = yield this.voter.findFirst({ where: {
                        name
                    } });
                if (existingRecord) {
                    throw new Error("The voter is already created");
                }
                const voter = yield this.voter.create({
                    data: {
                        name
                    },
                });
                return voter;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const destroy = yield this.voter.deleteMany({});
                return destroy.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createMany(voters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voter = yield this.voter.createMany({
                    data: voters
                });
                return voter.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voter = yield this.voter.update({
                    where: { id },
                    data: {
                        name
                    },
                });
                return voter;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voter = yield this.voter.delete({
                    where: { id },
                });
                return voter;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voters = yield this.voter.findMany({
                    where: { id, name },
                    include: {
                        votes: true,
                    },
                });
                return voters;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    generate(count) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.voter.deleteMany({});
                const input = [];
                for (let i = 1; i < count + 1; i++) {
                    input.push({
                        name: `Voter_${i}`,
                    });
                }
                const voters = yield this.voter.createMany({
                    data: input,
                });
                return voters.count;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = VoterService;
