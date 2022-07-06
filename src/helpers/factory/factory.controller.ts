import Service from "./interface";
import {NextFunction, Request, Response} from "express";
import {logTrace} from "../../utils/logger";


export default class FactoryController {
    service: Service<any>;

    constructor(service: Service<any>) {
        this.service = service;
    }

    createOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const body = req.body;
            const resp = await this.service.createOne(req.body);
            logTrace("CrateReslog", resp)
            res.json(resp).status(201);
        } catch (e: any) {
            logTrace("error", e)
            res.status(500).json({
                message: e.message,
            });
        }
    };
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.service.getAll();

            res.json({results: users, mes: "holla"});
        } catch (e: any) {
            res.status(500).json({
                message: e.message,
            });
        }
    };
    getOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const user = await this.service.getOneById(id);
            res.json(user);
        } catch (e: any) {
            res.status(500).json({
                message: e.message,
            });
        }
    };
    deleteOneById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            let cnt = await this.service.deleteOneById(id);
            if (cnt <= 0) {
                res.status(405).end()
            }
            res.status(204).end();
        } catch (e: any) {
            res.status(500).json({
                message: e.message,
            });
        }
    };

    updateOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;

            const resp = await this.service.updateOneById(id, req.body);

            res.json(resp).status(202);

        } catch (e: any) {
            res.status(500).json({
                message: e.message,
            });
        }
    };
}
