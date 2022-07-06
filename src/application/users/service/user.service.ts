import Web3 from "web3";
import {Contract} from "web3-eth-contract";
import {Block} from "../../../blockchain";
import {estimateTransaction, sendTransaction} from "../../../helpers/helper";
import {Account, BUserEntity} from "../models/user.model";

export default class UserService {
    private readonly web3: Web3 | undefined;
    private readonly contract: Contract | undefined;

    constructor(private blockchain: Block | any) {
        this.web3 = blockchain?.web3;
        this.contract = blockchain?.contract;
    }

    async createUser(user: BUserEntity): Promise<Account | undefined> {
        try {
            const mainAcc = "0xb4AC4B933b6273A6d752e212BA00ed0cCB246eDF";

            const newAccount = await this.web3?.eth.accounts.create(user.name);
            let address;
            let privateKey;
            if (newAccount) {
                await this.web3?.eth.accounts.wallet.add(newAccount);
                address = newAccount.address;
                privateKey = newAccount.privateKey;

                await this.web3?.eth.sendTransaction({
                    to: newAccount.address,
                    from: mainAcc,
                    value: this.web3.utils.toWei("5", "ether")
                });

                const tx = this.contract?.methods.createUser(user.name, user.phone, user.role);
                const estimate = await estimateTransaction(tx, this.web3, address);

                await sendTransaction(address, this.web3, this.contract, estimate);
                return {
                    address: address,
                    privateKey: privateKey,
                }
            }
        } catch (e) {
            throw Error(`Blockchain create user error ${e}`)
        }
    }

    async getUserByAddress(id: string): Promise<BUserEntity | undefined> {
        try {
            const data = await this.contract?.methods.getUserByAddress(id).call();
            return {
                id: data.id,
                name: data.name,
                phone: data.phone,
                role: data.role,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            }
        } catch (e) {
            throw Error(`Blockchain create user error ${e}`)
        }
    }

    async getAllUser(): Promise<BUserEntity[] | undefined> {
        try {
            const data = await this.contract?.methods.getAllUser().call();
            const newData: BUserEntity[] = []
            data.forEach((d: { name: any; phone: any; id: any; role: any;}) =>
                newData.push({
                    name: d.name,
                    phone: d.phone,
                    role: d.role,
                    id: d.id,
                }))
            return newData
        } catch (e) {
            throw Error(`Blockchain create user error ${e}`)
        }

    }
}