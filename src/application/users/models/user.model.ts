export interface BUserEntity {
    id?: string
    name?: string
    phone?: string
    role?: string
    createdAt?: string
    updatedAt?: string
}

export interface UserCreateInput {
    name?: string
    phone?: string
    role?: string
}

export enum roles {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SELLER = 'SELLER',
    SUPER = 'SUPER',
    DELIVERY = "DELIVERY"
}

export interface Account {
    address: string,
    privateKey: string,
}