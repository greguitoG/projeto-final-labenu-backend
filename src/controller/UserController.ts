import { Request, Response } from "express";
import userBusiness, { UserBusiness } from "../business/UserBusiness";
import { UserInputDTO } from "../model/User";

export class UserController {
    
    constructor(
        private userBusiness: UserBusiness
    ) {};

    public signup = async (req: Request, res: Response) => {
        try {
            const input: UserInputDTO = {
                name: req.body.name,
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password
            };

            const result = await this.userBusiness.signup(input);

            res.status(200).send(result);
        } catch (error) {
            const { statusCode, message } = error;
            res.status(statusCode || 400).send({ message });
        };
    };
};

export default new UserController(userBusiness)