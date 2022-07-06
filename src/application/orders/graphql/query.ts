export const OrderQuery = {
    getSellerOrders: {
        resolve: async (_: any, __: any, {dataSources}: any) => {
            return await dataSources.OrderServices.getSellerOrders()
        },
    },
    getUserOrders: {
        resolve: async (_: any, __: any, {dataSources}: any) => {
            return await dataSources.OrderServices.getUserOrders()
        },
    },
}