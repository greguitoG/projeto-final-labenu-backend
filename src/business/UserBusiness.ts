import userdatabase, { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../errors/CustomError";
import { User, UserInputDTO } from "../model/User";
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

    public signup = async (input: UserInputDTO) => {
        try {
            
            if (!input.name || 
                !input.nickname || 
                !input.email || 
                !input.password
            ) {
                throw new CustomError(422, "Missing input.");
            };
            
            if (input.email.indexOf("@") === -1) {
                throw new CustomError(422, "Invalid email.");
            };
            
            if (input.password.length < 6) {
                throw new CustomError(422, "Your password must have more than 6 characters.");
            };
                
            const id = this.idGenerator.generateId();

            const cypherPassword = await this.hashManager.hash(input.password);

            const newUser: User = new User(
                id,
                input.name,
                input.nickname,
                input.email,
                cypherPassword
            );
            
            await this.userDatabase.createUser(newUser);

            const token = this.authenticator.generateToken({id});

            return { token };
        } catch (error) {
            if (error.message.includes("for key 'email'")) {
                throw new CustomError(409, "E=mail already exists.");  
            };

            throw new CustomError(error.statusCode, error.message)  
        };
    };

    public login = async (
        email: string, 
        nickname: string, 
        password: string
    ) => {
        try {
            if (!(email ?? nickname) || !password) {
                throw new CustomError(422, "Missing input.");
            };

            if (email) {
                if (!email.includes("@")) {
                    throw new CustomError(422, "Invalid e-mail.");
                };
            };

            const user: User | undefined  = await this.userDatabase.getUserByEmailOrNickname(email ?? nickname);

            if (!user) {
                throw new CustomError(401, "Invalid credentials.");
            };

            console.log(user.getPassword)

            const isPasswordCorrect = this.hashManager.hashCompare(password, user.getPassword());

            if (!isPasswordCorrect) {
                throw new CustomError(401, "Invalid credentials.");  
            };

            const token = this.authenticator.generateToken({id: user.getId()});

            return { token };
        } catch (error) {
            throw new Error(error.message || error.sqlMessage);
        };
    };
};

export default new UserBusiness(
    idGenerator,
    authenticator,
    hashManager,
    userdatabase
);