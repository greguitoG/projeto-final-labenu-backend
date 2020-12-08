export interface AuthenticationData {
    id: string,
};

export class User {
    
    constructor (
        private id: string,
        private name: string,
        private nickname: string,
        private email: string,
        private password: string
    ) {}; 

    public getId = (): string => this.id;
    public getName = (): string => this.name;
    public getNickname = (): string => this.nickname;
    public getEmail = (): string => this.email;
    public getPassword = (): string => this.password;
};

export interface UserInput {
    id: string,
    name: string,
    nickname: string,
    email: string,
    password: string
};

export interface UserInputDTO {
    name: string,
    nickname: string,
    email: string,
    password: string
};

export interface LoginInputDTO {
    email: string,
    password: string
};