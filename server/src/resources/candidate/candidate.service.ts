import { Prisma } from '@/utils/prisma/prisma';
import { Candidate } from '@prisma/client';

class CandidateService {
    private candidate = Prisma.getPrisma().candidate;
    private vote = Prisma.getPrisma().vote;

    public async get(): Promise<Array<Candidate> | Error> {
        try {
            const candidates = await this.candidate.findMany({
                include: {
                    votes: true,
                },
            });
            return candidates;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async create(
        name: string,
        description: string
    ): Promise<Candidate | Error> {
        try {
            const existingRecord = await this.candidate.findFirst({where: {
                name
            }});
            if (existingRecord)  {
                throw new Error("The candidate is already registered");
            }
            const candidate = await this.candidate.create({
                data: {
                    name,
                    description,
                },
            });
            await this.vote.deleteMany({});
            return candidate;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createMany(
        candidates: Array<Candidate>
    ): Promise<Number | Error> {
        try {

            const candidate = await this.candidate.createMany({
                data: candidates
            });
            return candidate.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        id: number,
        name: string,
        description: string
    ): Promise<Candidate | Error> {
        try {
            const candidate = await this.candidate.update({
                where: { id },
                data: {
                    name,
                    description,
                },
            });
            return candidate;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(id: number): Promise<Candidate | Error> {
        try {
            const candidate = await this.candidate.delete({
                where: { id },
            });
            return candidate;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async destroy(): Promise<Number | Error> {
        try {
            const destroy = await this.candidate.deleteMany({});
            return destroy.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(
        id: number,
        name: string,
        description: string
    ): Promise<Array<Candidate> | Error> {
        try {
            const candidates = await this.candidate.findMany({
                where: { id, name, description },
                include: {
                    votes: true,
                },
            });
            return candidates;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async generate(count: number): Promise<Number | Error> {
        try {
            await this.candidate.deleteMany({});
            await this.vote.deleteMany({});
            const input = [];
            for (let i = 1; i < count + 1; i++) {
                input.push({
                    name: `Candidate_${i}`,
                });
            }
            const candidates = await this.candidate.createMany({
                data: input,
            });

            return candidates.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default CandidateService;
