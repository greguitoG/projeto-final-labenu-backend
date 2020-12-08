import userdatabase, { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../errors/CustomError";
import { UserInputDTO } from "../model/User";
import authenticator, { Authenticator } from "../services/Authenticator";
import hashManager, { HashManager } from "../services/HashManager";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class UserBusiness {

    constructor (
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private hashManager: HashManager,
        private userDatabase: UserDatabase
    ) {};

    public signup = async (user: UserInputDTO) => {
        try {
            
            if (!user.name || 
                !user.nickname || 
                !user.email || 
                !user.password
            ) {
                throw new CustomError(422, "Missing input.");
            };
            
            if (user.email.indexOf("@") === -1) {
                throw new CustomError(422, "Invalid email.");
            };
            
            if (user.password.length < 6) {
                throw new CustomError(422, "Your password must have more than 6 characters.");
            };
                
            const id = this.idGenerator.generateId();

            const cypherPassword = await this.hashManager.hash(user.password);
            
            await this.userDatabase.createUser({
                id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                password: cypherPassword
            });

            const token = this.authenticator.generateToken({id});

            return { token };
        } catch (error) {
            if (error.message.includes("for key 'email'")) {
                throw new CustomError(409, "E=mail already exists.");  
            };

            throw new CustomError(error.statusCode, error.message)  
        };
    };
};

export default new UserBusiness(
    idGenerator,
    authenticator,
    hashManager,
    userdatabase
);