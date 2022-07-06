const Provider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const SupplyChain = require("../build/contracts/SupplyChain.json");
const ProductContract = require("../build/contracts/ProductContract.json");
const UserContract = require("../build/contracts/UserContract.json");
const OrderContract = require("../build/contracts/OrderContract.json");
const {Common} = require("web3-core");

async function Blockchain() {
    const privateKey = "57097007a9cc5c5a3599172c043823bb2a2cd20b796e6a87f4d22430f7586fab";

    const provider = new Provider(privateKey, "http://127.0.0.1:7545");
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();

    const contractAddress = SupplyChain.networks[networkId].address;
    const productContractAddress = ProductContract.networks[networkId].address;
    const userContractAddress = UserContract.networks[networkId].address;
    const OrderContractAddress = OrderContract.networks[networkId].address;

    const cont = new web3.eth.Contract(SupplyChain.abi, contractAddress);
    console.log("setProductContractAddress")
    await cont.methods.setProductContractAddress(productContractAddress).send({from: "0xEF2258AFCbABf99E0ff1acf010aD71c1EbF4666a"})
    console.log("setUserContractAddress")
    await cont.methods.setUserContractAddress(userContractAddress).send({from: "0xEF2258AFCbABf99E0ff1acf010aD71c1EbF4666a"})
    console.log("setOrderContractAddress")
    await cont.methods.setOrderContractAddress(OrderContractAddress).send({from: "0xEF2258AFCbABf99E0ff1acf010aD71c1EbF4666a"})
    console.log("Done")
}

Blockchain();
