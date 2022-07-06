import {BProductEntity} from "../models/IItem";
import {ApolloError} from "apollo-server-core";


export const ItemMutation = {
    createItem: async (_: any, args: { input: { product: BProductEntity, address: string }; }, {
        dataSources,
    }: any) => {
        try {
            return await dataSources.ItemServices.createProduct(args.input.product, args.input.address)
        } catch (e: any) {
            throw new ApolloError(e, "400")
        }
    },
    buyItem: async (_: any, args: { input: { productId: string; newMongoId: string; amount: string; address: string; }; }, {
        dataSources,
    }: any) => {
        try {
            await dataSources.ItemServices.buyProduct(
                args.input.productId, args.input.newMongoId, args.input.amount, args.input.address,)
        } catch (e: any) {
            throw new ApolloError(e, "400")
        }
    },
}