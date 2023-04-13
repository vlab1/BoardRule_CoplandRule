import { Prisma } from '@/utils/prisma/prisma';
import { Voter } from '@prisma/client';

class VoterService {
    private voter = Prisma.getPrisma().voter;

    public async get(): Promise<Array<Voter> | Error> {
        try {
            const voters = await this.voter.findMany({
                include: {
                    votes: true,
                },
            });
            return voters;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async create(
        name: string
    ): Promise<Voter | Error> {
        try {
            const existingRecord = await this.voter.findFirst({where: {
                name
            }});
            if (existingRecord)  {
                throw new Error("The voter is already created");
            }
            const voter = await this.voter.create({
                data: {
                    name
                },
            });
            return voter;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async destroy(): Promise<Number | Error> {
        try {
            const destroy = await this.voter.deleteMany({});
            return destroy.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createMany(
        voters: Array<Voter>
    ): Promise<Number | Error> {
        try {

            const voter = await this.voter.createMany({
                data: voters
            });
            return voter.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async update(
        id: number,
        name: string,
    ): Promise<Voter | Error> {
        try {
            const voter = await this.voter.update({
                where: { id },
                data: {
                    name
                },
            });
            return voter;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete(id: number): Promise<Voter | Error> {
        try {
            const voter = await this.voter.delete({
                where: { id },
            });
            return voter;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(
        id: number,
        name: string
    ): Promise<Array<Voter> | Error> {
        try {
            const voters = await this.voter.findMany({
                where: { id, name },
                include: {
                    votes: true,
                },
            });
            return voters;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async generate(count: number): Promise<Number | Error> {
        try {
            await this.voter.deleteMany({});
            const input = [];
            for (let i = 1; i < count + 1; i++) {
                input.push({
                    name: `Voter_${i}`,
                });
            }
            const voters = await this.voter.createMany({
                data: input,
            });

            return voters.count;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default VoterService;
