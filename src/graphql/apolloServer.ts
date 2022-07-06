import express from "express";
import {ApolloServer} from "apollo-server-express";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";

import {typeDefs} from "./schemas";
import {resolvers} from "./resolvers";

import httpServer from "../app";

import Blockchain from "../blockchain";
import UserService from "../application/users/service/user.service";
import ItemService from "../application/item/service/item.service";
import OrderService from "../application/orders/service/order.service";

export const createServer = async () => {
    const blockchain = await Blockchain();

    return new ApolloServer({
        schema: makeExecutableSchema({
            typeDefs: [typeDefs],
            resolvers: resolvers,
        }),
        csrfPrevention: true,
        introspection: true,

        // @ts-ignore
        dataSources: () => {
            return {
                UserServices: new UserService(blockchain),
                ItemServices: new ItemService(blockchain),
                OrderServices: new OrderService(blockchain),
            };
        },

        // @ts-ignore
        plugins: [ApolloServerPluginLandingPageLocalDefault({httpServer})],
    })
}

export default async function startApolloServer(app: express.Application) {

    const server = await createServer()
    await server.start();
    server.applyMiddleware({
        app,
        cors: false
    });

    return server.graphqlPath
}
