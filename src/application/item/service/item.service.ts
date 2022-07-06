import {BProductEntity, BProductEntityHistory} from "../models/IItem";
import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {Block} from "../../../blockchain";
import {estimateTransaction, sendTransaction} from "../../../helpers/helper";

export default class ItemService {
    private readonly web3: Web3 | undefined;
    private readonly contract: Contract | undefined;

    constructor(private blockchain: Block | undefined) {
        this.web3 = blockchain?.web3;
        this.contract = blockchain?.contract;
    }

    async createProduct(item: BProductEntity, address: string): Promise<BProductEntity | undefined> {
        try {
            const tx = await this.contract?.methods.createProduct(
                item.mongoId, item.productName, item.category, item.price, item.description, item.count);
            const estimate = await estimateTransaction(tx, this.web3, address);
            await sendTransaction(address, this.web3, this.contract, estimate);
            return item
        } catch (e) {
            throw new Error(`Item create on blockchain failed.${e}`);
        }
    }

    async getAllProducts(): Promise<BProductEntity[] | undefined> {
        const data = await this.blockchain?.contract.methods.getAllProducts().call();
        const newData: BProductEntity[] = []
        data.forEach((d: { mongoId: any; name: any; price: any; category: any; description: any; owner: any; count: any; }) =>
            newData.push({
                mongoId: d.mongoId,
                productName: d.name,
                price: d.price,
                category: d.category,
                count: d.count,
                description: d.description,
                owner: d.owner,
            }))
        return newData
    }

    async getProductById(mongoId: string): Promise<BProductEntity | undefined> {
        const data = await this.blockchain?.contract.methods.getSingleProductById(mongoId).call();
        return {
            mongoId: data.mongoId,
            productName: data.name,
            price: data.price,
            category: data.category,
            description: data.description,
            count: data.count,
            owner: data.owner,
        }
    }

    async buyProduct(productId: string, newMongoId: string, amount: number, address: string) {
        try {
            const tx = await this.blockchain?.contract.methods.buyProduct(productId, newMongoId, amount);
            const estimate = await estimateTransaction(tx, this.web3, address);
            await sendTransaction(address, this.web3, this.contract, estimate);
        } catch (e) {
            throw new Error(`Item buy on blockchain failed.${e}`);
        }
    }

    async getProductHistory(id: string): Promise<BProductEntityHistory[] | undefined> {
        const data = await this.blockchain?.contract.methods.getProductHistory(id).call()
        const newData: BProductEntityHistory[] = [];
        data.forEach((d: {
            prevOwner: any;
            mongoId: any;
            productName: any;
            category: any;
            price: any;
            description: any;
            actionName: any;
            prevOwnerName: any;
            transferDate: any;
        }) => newData.push({
            prevOwner: d.prevOwner,
            mongoId: d.mongoId,
            productName: d.productName,
            category: d.category,
            price: d.price,
            description: d.description,
            prevOwnerName: d.prevOwnerName,
            actionName: d.actionName,
            transferDate: d.transferDate,
        }));
        return newData
    }
}