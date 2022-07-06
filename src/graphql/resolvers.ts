import {UserQuery} from "../application/users/graphql/user.Query";
import {UserMutation} from "../application/users/graphql/user.mutation";

import {OrderQuery} from "../application/orders/graphql/query";
import {OrderMutation} from "../application/orders/graphql/mutation";

import {ItemQuery} from "../application/item/graphql/item.query";
import {ItemMutation} from "../application/item/graphql/item.mutation";


export const UserResolver = {
    Query: UserQuery,
    Mutation: UserMutation
}

export const ItemResolver = {
    Query: ItemQuery,
    Mutation: ItemMutation
}

export const OrderResolver = {
    Query: OrderQuery,
    Mutation: OrderMutation
}


export const resolvers = [UserResolver, ItemResolver, OrderResolver];