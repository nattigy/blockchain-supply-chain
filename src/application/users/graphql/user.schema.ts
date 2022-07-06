import {gql} from "apollo-server-express";

/**
 * @description holds user schema
 */

export const UserSchema = gql`

  type User {
    id: ID
    name: String
    phone: String
    role: String
    createdAt:String
    updatedAt:String
  }
  
  input UserCreateInput {
    name: String
    phone: String
    role: UserRoles=USER
  }

  type Account {
    address: String,
    privateKey: String,
  }
  
  enum UserRoles{
    USER
    ADMIN
    SELLER
    SUPER
    DELIVERY
  }

  extend type Query {
    getAllUsers: [User]!
    getUserById(id: String!): User
  }
  
  extend type Mutation {
    createUser(input: UserCreateInput!): Account
  }
  
`