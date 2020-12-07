import * as jwt from "jsonwebtoken";
import { AuthenticationData } from "../model/User";

export class Authenticator {
    public generateToken = (payload: AuthenticationData): string => {
        return jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
    };

    public getTokenData = (token: string): AuthenticationData => {
        const result = jwt.verify(
            token,
            process.env.JWT_KEY as string
        ) as AuthenticationData;

        return {id: result.id};
    };
};