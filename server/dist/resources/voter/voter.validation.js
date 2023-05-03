"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const create = joi_1.default.object({
    name: joi_1.default.string().required(),
});
const update = joi_1.default.object({
    id: joi_1.default.number().required(),
    name: joi_1.default.string(),
});
const remove = joi_1.default.object({
    id: joi_1.default.number().required(),
});
const find = joi_1.default.object({
    id: joi_1.default.number(),
    name: joi_1.default.string(),
});
const generate = joi_1.default.object({
    count: joi_1.default.number().required()
});
const createMany = joi_1.default.object({
    voters: joi_1.default.array().items({
        name: joi_1.default.string().required()
    })
});
exports.default = { create, update, remove, find, generate, createMany };
