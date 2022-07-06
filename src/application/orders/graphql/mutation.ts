import {BOrderEntity, ShipmentItem} from "../models/order.model";

export const OrderMutation = {
    createOrder: {
        resolve: async (_: any, args: { input: { order: BOrderEntity; orderItem: ShipmentItem[] } }, {dataSources, loggedInUserId, blockchainAddress}: any) => {
            const ownerAddress = "0x5911D2DA8CFb19EBF6C8abFbf3Dcb63DeB92650b";
            return await dataSources.OrderServices.createOrder(args.input.order, args.input.orderItem, "0x5911D2DA8CFb19EBF6C8abFbf3Dcb63DeB92650b", ownerAddress);
        },
    },
}