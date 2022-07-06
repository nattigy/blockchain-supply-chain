import {gql} from "apollo-server-express";

/**
 * @description holds user schema
 */

export const GqOrderSchema = gql`

  type Order {
    purchaseId: String
    shipmentStatus: OrderStatus
    deliveryAddress: String
    orderedBy: String
    isConfirmed: String
    isActive: String
    isCanceled: String
    createdAt: String
    updatedAt: String
  }
#  type OrderActions {
#    orderActionType: OrderActionsTypes
#    date: String
#    message: String
#  }
#  type OrderItems{
#    description: String
#    productId: String
#    newMongoId: String
#    price: Int
#    amount: Int
#  }
  
#  enum OrderActionsTypes{
#    PlacedOrder,
#    CancelOrder
#
#    AcceptedBySeller
#    DeclinedBySeller
#
#    RequestDelivery
#    AcceptedByDelivery
#    DeclinedByDelivery
#    ReceivedByDelivery
#    ReceivedByUser
#    ReturnedByDelivery
#  }

  enum OrderStatus{
    PENDING
    ACCEPTED
    CANCELED
    DELIVERED
    ON_DELIVERY
  }

  extend type Query {
#    getOrderByUserId(status: OrderStatus):[Order]
#    getOrderByDelivery(deliveryStatus: OrderDeliveryStatus):[Order]
    getAllOrders: [Order]
    getSellerOrders: [Order]
    getUserOrders: [Order]
#    getOneOrder(id: String!): Order
  }

  input OrderItemsInput {
    description: String
    productId: String
    newMongoId: String
    price: Int
    amount: Int
  }

  input OrderInput {
    purchaseId: String
    shipmentStatus: OrderStatus
    deliveryAddress: String
    orderedBy: String
    isConfirmed: Boolean
  }
  input OrderCreateInput {
    order: OrderInput
    orderItem: [OrderItemsInput]
  }
  
  extend type Mutation {
    createOrder(input: OrderCreateInput!): Order
#    createManyOrders(input: [OrderCreateInput!]!): [Order]
#
#    orderAction(orderId:ID,action:OrderActionsTypesInput ):Order
#    #        acceptOrder(orderId:String):Boolean
#
#
#    updateOrder(id:ID, input: UpdateOrderInput!): Order
#    #        updateOrderStatus(id:String, status: OrderStatus!): Order
#    deleteOrder(id: ID!): Order
#    deleteALlOrders: Int
  }


`