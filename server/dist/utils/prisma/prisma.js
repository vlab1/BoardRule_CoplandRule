"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = void 0;
const client_1 = require("@prisma/client");
class Prisma {
    static getPrisma() {
        this.Prisma || (this.Prisma = new client_1.PrismaClient());
        return this.Prisma;
    }
}
exports.Prisma = Prisma;
