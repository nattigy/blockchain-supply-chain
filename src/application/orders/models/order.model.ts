export interface BOrderEntity {
    purchaseId?: any
    shipmentStatus: OrderStatus
    deliveryAddress: string
    orderedBy?: string
    isConfirmed?: string
    orderedItems: ShipmentItem[]
    isActive?: string
    isCanceled: string
    createdAt: string
    updatedAt: string
}

export interface ShipmentHistory {
    orderActionType: OrderActionsTypes
    message: string
    date: string
}

export interface ShipmentItem {
    description: string
    productId: string
    newMongoId: string
    price: number
    amount: number
}

export enum OrderActionsTypes {
    PlacedOrder = "PlacedOrder",
    CancelOrder = "CancelOrder",

    AcceptedBySeller = "AcceptedBySeller",
    DeclinedBySeller = "DeclinedBySeller",

    RequestDelivery = "RequestDelivery",
    AcceptedByDelivery = "AcceptedByDelivery",
    DeclinedByDelivery = "DeclinedByDelivery",

    ReceivedByDelivery = "ReceivedByDelivery",
    ReturnedByDelivery = "ReturnedByDelivery",
    ReceivedByUser = "ReceivedByUser",
}


export enum OrderStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    CANCELED = "CANCELED",
    DELIVERED = "DELIVERED",
    ON_DELIVERY = "ON_DELIVERY",
}

