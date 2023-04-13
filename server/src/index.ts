import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import VoterController from '@/resources/voter/voter.controller';
import CandidateController from '@/resources/candidate/candidate.controller';
import VoteController from '@/resources/vote/vote.controller';
validateEnv();

const app = new App(
    [
        new VoterController(),
        new CandidateController(),
        new VoteController()
    ],
    Number(process.env.PORT)
);

app.listen()
