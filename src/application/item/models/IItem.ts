export interface BProductEntity {
    mongoId?: string;
    productName?: string;
    description?: string;
    category?: string;
    price?: number
    owner?: string,
    count?: number,
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BProductEntityHistory {
    prevOwner: string;
    mongoId: string;
    productName: string;
    category: string;
    price: number;
    description: string;
    actionName: string;
    prevOwnerName: string;
    transferDate: number;
}