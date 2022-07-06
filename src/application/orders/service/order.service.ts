import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {Block} from "../../../blockchain";
import {BOrderEntity, ShipmentItem} from "../models/order.model";
import {estimateTransaction, sendTransaction} from "../../../helpers/helper";
import {logTrace} from "../../../utils/logger";


export default class OrderService {
    private readonly web3: Web3 | undefined;
    private readonly contract: Contract | undefined;

    constructor(blockchain: Block | any) {
        this.web3 = blockchain?.web3;
        this.contract = blockchain?.contract;
    }

    async createOrder(order: BOrderEntity, orderItems: ShipmentItem[], address: string, ownerAddress: string) {
        try {
            logTrace("order", {order, orderItems})
            const tx = this.contract?.methods.createOrder(ownerAddress, order.shipmentStatus, "order.deliveryAddress", order.purchaseId);

            const estimate = await estimateTransaction(tx, this.web3, address);

            await sendTransaction(address, this.web3, this.contract, estimate);

            for(let i = 0; i < orderItems.length; i++) {
                const addItemTx = this.contract?.methods.addItemToOrder(order.purchaseId, orderItems[i]);

                const estimate = await estimateTransaction(addItemTx, this.web3, address);

                await sendTransaction(address, this.web3, this.contract, estimate);
            }

        } catch (e) {
            throw Error(`blockchain order error: ${e}`)
        }
    }

    async getUserOrders(address: string): Promise<BOrderEntity[] | undefined> {
        throw Error(`blockchain order error: {e}`)
    }

    async getSellerOrders(address: string): Promise<BOrderEntity[] | undefined> {
        throw Error(`blockchain order error: {e}`)
    }
}
