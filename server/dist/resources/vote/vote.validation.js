"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const create = joi_1.default.object({
    candidateId: joi_1.default.number().required(),
    voterId: joi_1.default.number().required(),
    place: joi_1.default.number().min(1).required()
});
const update = joi_1.default.object({
    candidateId: joi_1.default.number().required(),
    voterId: joi_1.default.number().required(),
    place: joi_1.default.number().min(1)
});
const remove = joi_1.default.object({
    candidateId: joi_1.default.number().required(),
    voterId: joi_1.default.number().required(),
});
const find = joi_1.default.object({
    candidateId: joi_1.default.number(),
    voterId: joi_1.default.number(),
    place: joi_1.default.number()
});
const createMany = joi_1.default.object({
    votes: joi_1.default.array().items({
        candidateId: joi_1.default.number().required(),
        voterId: joi_1.default.number().required(),
        place: joi_1.default.number().min(1).required()
    })
});
exports.default = { create, update, remove, find, createMany };
