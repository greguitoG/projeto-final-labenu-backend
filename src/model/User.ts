export interface AuthenticationData {
    id: string,
};

export interface User {
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