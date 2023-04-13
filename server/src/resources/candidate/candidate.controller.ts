import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/candidate/candidate.validation';
import CandidateService from '@/resources/candidate/candidate.service';

class CandidateController implements Controller {
    public path = '/candidate';
    public router = Router();
    private CandidateService = new CandidateService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.create),
            this.create
        );
        this.router.post(
            `${this.path}/create-many`,
            validationMiddleware(validate.createMany),
            this.createMany
        );
        this.router.put(
            `${this.path}/update`,
            validationMiddleware(validate.update),
            this.update
        );
        this.router.delete(
            `${this.path}/delete`,
            validationMiddleware(validate.remove),
            this.delete
        );
        this.router.delete(
            `${this.path}/destroy`,
            this.destroy
        );
        this.router.get(`${this.path}/get`, this.get);
        this.router.get(
            `${this.path}/find`,
            validationMiddleware(validate.find),
            this.find
        );
        this.router.post(
            `${this.path}/generate`,
            validationMiddleware(validate.generate),
            this.generate
        );
    }

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const candidates = await this.CandidateService.get();

            res.status(201).json({ data: candidates });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, description } = req.body;

            const candidate = await this.CandidateService.create(
                name,
                description
            );

            res.status(201).json({ data: candidate });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private createMany = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { candidates } = req.body;

            const candidate = await this.CandidateService.createMany(
                candidates
            );

            res.status(201).json({ data: candidate });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id, name, description } = req.body;

            const candidate = await this.CandidateService.update(
                id,
                name,
                description
            );

            res.status(201).json({ data: candidate });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.body;

            const candidate = await this.CandidateService.delete(id);

            res.status(201).json({ data: candidate });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private destroy = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const candidate = await this.CandidateService.destroy();

            res.status(201).json({ data: candidate });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private find = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id, name, description } = req.body;

            const candidates = await this.CandidateService.find(
                id,
                name,
                description
            );

            res.status(201).json({ data: candidates });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private generate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { count } = req.body;

            const candidates = await this.CandidateService.generate(count);

            res.status(201).json({ data: candidates });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default CandidateController;
