import { User } from "../model/User";
import BaseDatabase from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    private static tableName: string = "labemusic_users";

    private toModel(dbModel?: any): User | undefined {
        return (
            dbModel &&
            new User (
                dbModel.id,
                dbModel.name,
                dbModel.nickname,
                dbModel.email,
                dbModel.password
            )
        );
    };
    
    public createUser = async (user: User): Promise<void> => {
        try {
            await BaseDatabase.connection(UserDatabase.tableName)
            .insert({
                id: user.getId(),
                name: user.getName(),
                nickname: user.getNickname(),
                email: user.getEmail(),
                password: user.getPassword()
            });    
        } catch (error) {
            throw new Error(error.message || error.sqlMessage);
        };
    };

    public getUserByEmailOrNickname = async (input: string): Promise<User | undefined> => {
        try {
            const result = await BaseDatabase.connection(UserDatabase.tableName)
            .select("*")
            .where({email: input})
            .orWhere({nickname: input});

            return this.toModel(result[0]);
        } catch (error) {
            throw new Error(error.message || error.sqlMessage);
        };
    };
};

export default new UserDatabase();