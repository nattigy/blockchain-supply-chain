import {gql} from "apollo-server-express";

/**
 * @description holds user schema
 */

export const GqlItemSchema = gql`
  
  type Item  {
    mongoId: String
    productName: String
    description: String
    category: String
    price: Int
    owner: String
    count: Int
    createdAt: String
    updatedAt: String  
  }
  
  type ItemHistory  {
    prevOwner: String
    mongoId: String
    productName: String
    category: String
    price: Int
    description: String
    actionName: String
    prevOwnerName: String
    transferDate: Int
  }

  input ItemInput  {
    mongoId: String
    productName: String
    description: String
    category: String
    price: Int
    owner: String
    count: Int
    createdAt: String
    updatedAt: String
  }
  
  extend type Query {
    getAllItems: [Item]
    getOneItemById(id: String!): Item
    getItemHistory(id: String!): [ItemHistory]
  }
  
  input ItemCreateInput{
    product: ItemInput
    address: String
  }
  
  input ItemBuyInput{
    productId: String 
    newMongoId: String 
    amount: Int
    address: String
  }
  extend type Mutation {
    createItem(input: ItemCreateInput!): Item
    buyItem(input: ItemBuyInput!): Item
  }

`