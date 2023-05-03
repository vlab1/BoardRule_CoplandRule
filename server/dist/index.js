"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const validateEnv_1 = __importDefault(require("@/utils/validateEnv"));
const app_1 = __importDefault(require("./app"));
const voter_controller_1 = __importDefault(require("@/resources/voter/voter.controller"));
const candidate_controller_1 = __importDefault(require("@/resources/candidate/candidate.controller"));
const vote_controller_1 = __importDefault(require("@/resources/vote/vote.controller"));
(0, validateEnv_1.default)();
const app = new app_1.default([
    new voter_controller_1.default(),
    new candidate_controller_1.default(),
    new vote_controller_1.default()
], Number(process.env.PORT));
app.listen();
