import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/voter/voter.validation';
import VoterService from '@/resources/voter/voter.service';

class VoterController implements Controller {
    public path = '/voter';
    public router = Router();
    private VoterService = new VoterService();

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
        this.router.delete(
            `${this.path}/destroy`,
            this.destroy
        );
    }

    private get = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const voters = await this.VoterService.get();

            res.status(201).json({ data: voters });
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
            const { name } = req.body;

            const voter = await this.VoterService.create(
                name
            );

            res.status(201).json({ data: voter });
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
            const voter = await this.VoterService.destroy();

            res.status(201).json({ data: voter });
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
            const { voters } = req.body;

            const voter = await this.VoterService.createMany(
                voters
            );

            res.status(201).json({ data: voter });
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
            const { id, name } = req.body;

            const voter = await this.VoterService.update(
                id,
                name,               
            );

            res.status(201).json({ data: voter });
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

            const voter = await this.VoterService.delete(id);

            res.status(201).json({ data: voter });
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
            const { id, name } = req.body;

            const voter = await this.VoterService.find(
                id,
                name
            );

            res.status(201).json({ data: voter });
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

            const voters = await this.VoterService.generate(count);

            res.status(201).json({ data: voters });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}


export default VoterController;
