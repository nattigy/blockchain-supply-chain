export const ItemQuery = {
    getAllItems: {
        resolve: async (_: any, __: any, {dataSources}: any) => {
            return await dataSources.ItemServices.getAllProducts()
        },
    },
    getOneItemById: {
        resolve: async (_: any, args: { id: string; }, {dataSources}: any) => {
            return await dataSources.ItemServices.getProductById(args.id)
        },
    },
    getItemHistory: {
        resolve: async (_: any, args: { id: string; }, {dataSources}: any) => {
            return await dataSources.ItemServices.getProductHistory(args.id)
        },
    },
}