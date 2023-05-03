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
const candidate_validation_1 = __importDefault(require("@/resources/candidate/candidate.validation"));
const candidate_service_1 = __importDefault(require("@/resources/candidate/candidate.service"));
class CandidateController {
    constructor() {
        this.path = '/candidate';
        this.router = (0, express_1.Router)();
        this.CandidateService = new candidate_service_1.default();
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield this.CandidateService.get();
                res.status(201).json({ data: candidates });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                const candidate = yield this.CandidateService.create(name, description);
                res.status(201).json({ data: candidate });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.createMany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { candidates } = req.body;
                const candidate = yield this.CandidateService.createMany(candidates);
                res.status(201).json({ data: candidate });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, description } = req.body;
                const candidate = yield this.CandidateService.update(id, name, description);
                res.status(201).json({ data: candidate });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const candidate = yield this.CandidateService.delete(id);
                res.status(201).json({ data: candidate });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.destroy = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield this.CandidateService.destroy();
                res.status(201).json({ data: candidate });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.find = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, description } = req.body;
                const candidates = yield this.CandidateService.find(id, name, description);
                res.status(201).json({ data: candidates });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.generate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { count } = req.body;
                const candidates = yield this.CandidateService.generate(count);
                res.status(201).json({ data: candidates });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/create`, (0, validation_middleware_1.default)(candidate_validation_1.default.create), this.create);
        this.router.post(`${this.path}/create-many`, (0, validation_middleware_1.default)(candidate_validation_1.default.createMany), this.createMany);
        this.router.put(`${this.path}/update`, (0, validation_middleware_1.default)(candidate_validation_1.default.update), this.update);
        this.router.delete(`${this.path}/delete`, (0, validation_middleware_1.default)(candidate_validation_1.default.remove), this.delete);
        this.router.delete(`${this.path}/destroy`, this.destroy);
        this.router.get(`${this.path}/get`, this.get);
        this.router.get(`${this.path}/find`, (0, validation_middleware_1.default)(candidate_validation_1.default.find), this.find);
        this.router.post(`${this.path}/generate`, (0, validation_middleware_1.default)(candidate_validation_1.default.generate), this.generate);
    }
}
exports.default = CandidateController;
