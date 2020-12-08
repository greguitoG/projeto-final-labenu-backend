import { v4 } from "uuid";

export class IdGenerator {
    public generateId = (): string => v4();
};

export default new IdGenerator();