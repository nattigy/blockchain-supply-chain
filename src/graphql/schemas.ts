import {gql} from "apollo-server-express";
import {UserSchema} from "../application/users/graphql/user.schema";
import {GqlItemSchema} from "../application/item/graphql/gql.item.schema";
import {GqOrderSchema} from "../application/orders/graphql/gq.order.schema";


export const DefaultSchema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

export const typeDefs = [DefaultSchema, UserSchema, GqlItemSchema, GqOrderSchema];

