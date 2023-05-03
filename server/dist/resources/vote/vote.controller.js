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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const validation_middleware_1 = __importDefault(require("@/middleware/validation.middleware"));
const vote_validation_1 = __importDefault(require("@/resources/vote/vote.validation"));
const vote_service_1 = __importDefault(require("@/resources/vote/vote.service"));
class VoteController {
    constructor() {
        this.path = '/vote';
        this.router = (0, express_1.Router)();
        this.VoteService = new vote_service_1.default();
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const votes = yield this.VoteService.get();
                res.status(201).json({ data: votes });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId, voterId, place } = req.body;
                const vote = yield this.VoteService.create(candidateId, voterId, place);
                res.status(201).json({ data: vote });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.createMany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { votes } = req.body;
                const vote = yield this.VoteService.createMany(votes);
                res.status(201).json({ data: vote });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.destroy = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const vote = yield this.VoteService.destroy();
                res.status(201).json({ data: vote });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId, voterId, place } = req.body;
                const vote = yield this.VoteService.update(candidateId, voterId, place);
                res.status(201).json({ data: vote });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId, voterId } = req.body;
                const vote = yield this.VoteService.delete(candidateId, voterId);
                res.status(201).json({ data: vote });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidateId, voterId, place } = req.body;
                const votes = yield this.VoteService.find(candidateId, voterId, place);
                res.status(201).json({ data: votes });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.generate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const votes = yield this.VoteService.generate();
                res.status(201).json({ data: votes });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.boardRule = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const boardRule = yield this.VoteService.boardRule();
                res.status(201).json({ data: boardRule });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.coplandRule = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const coplandRule = yield this.VoteService.coplandRule();
                res.status(201).json({ data: coplandRule });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.tableBoardRule = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tableBoardRule = yield this.VoteService.tableBoardRule();
                res.status(201).json({ data: tableBoardRule });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.tableCoplandRule = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tableCoplandRule = yield this.VoteService.tableCoplandRule();
                res.status(201).json({ data: tableCoplandRule });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/create`, (0, validation_middleware_1.default)(vote_validation_1.default.create), this.create);
        this.router.post(`${this.path}/create-many`, (0, validation_middleware_1.default)(vote_validation_1.default.createMany), this.createMany);
        this.router.put(`${this.path}/update`, (0, validation_middleware_1.default)(vote_validation_1.default.update), this.update);
        this.router.delete(`${this.path}/delete`, (0, validation_middleware_1.default)(vote_validation_1.default.remove), this.delete);
        this.router.get(`${this.path}/get`, this.get);
        this.router.get(`${this.path}/find`, (0, validation_middleware_1.default)(vote_validation_1.default.find), this.find);
        this.router.post(`${this.path}/generate`, this.generate);
        this.router.get(`${this.path}/board-rule`, this.boardRule);
        this.router.get(`${this.path}/copland-rule`, this.coplandRule);
        this.router.get(`${this.path}/table/copland-rule`, this.tableCoplandRule);
        this.router.get(`${this.path}/table/board-rule`, this.tableBoardRule);
        this.router.delete(`${this.path}/destroy`, this.destroy);
    }
}
exports.default = VoteController;
