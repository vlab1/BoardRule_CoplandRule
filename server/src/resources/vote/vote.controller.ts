import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/vote/vote.validation';
import VoteService from '@/resources/vote/vote.service';

class VoteController implements Controller {
    public path = '/vote';
    public router = Router();
    private VoteService = new VoteService();

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
            this.generate
        );
        this.router.get(
            `${this.path}/board-rule`,
            this.boardRule
        );
        this.router.get(
            `${this.path}/copland-rule`,
            this.coplandRule
        );
        this.router.get(
            `${this.path}/table/copland-rule`,
            this.tableCoplandRule
        );
        this.router.get(
            `${this.path}/table/board-rule`,
            this.tableBoardRule
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
            const votes = await this.VoteService.get();

            res.status(201).json({ data: votes });
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
            const { candidateId, voterId, place } = req.body;

            const vote = await this.VoteService.create(
                candidateId,
                voterId,
                place
            );

            res.status(201).json({ data: vote });
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
            const { votes } = req.body;

            const vote = await this.VoteService.createMany(
                votes
            );

            res.status(201).json({ data: vote });
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
            const vote = await this.VoteService.destroy();

            res.status(201).json({ data: vote });
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
            const { candidateId, voterId, place } = req.body;

            const vote = await this.VoteService.update(
                candidateId,
                voterId,
                place
            );

            res.status(201).json({ data: vote });
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
            const { candidateId, voterId } = req.body;

            const vote = await this.VoteService.delete(candidateId, voterId);

            res.status(201).json({ data: vote });
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
            const { candidateId, voterId, place } = req.body;

            const votes = await this.VoteService.find(
                candidateId,
                voterId,
                place
            );

            res.status(201).json({ data: votes });
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

            const votes = await this.VoteService.generate();

            res.status(201).json({ data: votes });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private boardRule = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {

            const boardRule = await this.VoteService.boardRule();

            res.status(201).json({ data: boardRule });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private coplandRule = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {

            const coplandRule = await this.VoteService.coplandRule();

            res.status(201).json({ data: coplandRule });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private tableBoardRule = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {

            const tableBoardRule = await this.VoteService.tableBoardRule();

            res.status(201).json({ data: tableBoardRule });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private tableCoplandRule = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {

            const tableCoplandRule = await this.VoteService.tableCoplandRule();

            res.status(201).json({ data: tableCoplandRule });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default VoteController;
