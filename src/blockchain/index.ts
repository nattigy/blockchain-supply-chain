import Web3 from "web3";
import ContractObject from "../../build/contracts/SupplyChain.json";
import {Contract} from "web3-eth-contract";

export interface Block {
    contract: Contract;
    web3: Web3;
}

export default async function Blockchain(): Promise<Block | undefined> {
    try {
        const web3 = new Web3("http://127.0.0.1:7545");
        const networkId = await web3.eth.net.getId();
        // @ts-ignore
        const contractAddress: string = ContractObject.networks[networkId].address;
        // @ts-ignore
        const cont = await new web3.eth.Contract(ContractObject.abi, contractAddress)
        return {
            // @ts-ignore
            contract: cont,
            web3: web3
        }
    } catch (e) {
        console.log(e)
        return undefined
    }
}