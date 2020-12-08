import { User } from "../model/User";
import BaseDatabase from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    private static tableName: string = "labemusic_users";
    
    public createUser = async (user: User): Promise<void> => {
        try {
            await BaseDatabase.connection(UserDatabase.tableName)
            .insert({
                id: user.id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                password: user.password
            });
            
        } catch (error) {
            throw new Error(error.message || error.sqlMessage);
        };
    };
};

export default new UserDatabase();