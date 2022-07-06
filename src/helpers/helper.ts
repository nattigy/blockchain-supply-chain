interface Estimation {
    gas: number | string,
    gasPrice: number | string | any,
    data: string,
    nonce: number,
    chainId: number
}

export async function estimateTransaction(tx: any, web3: any, address: string): Promise<Estimation> {

    const gas = await tx.estimateGas({from: address});
    const gasPrice = await web3?.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3?.eth.getTransactionCount(address);
    const chainId = await web3?.eth.net.getId();

    return {
        gas, gasPrice, data, nonce, chainId
    }
}

export async function sendTransaction(address: string, web3: any, contract: any, estimate: Estimation): Promise<any> {

    return web3?.eth.sendTransaction({
        from: address,
        to: contract?.options.address,
        data: estimate.data,
        gas: estimate.gas,
        gasPrice: estimate.gasPrice,
        nonce: estimate.nonce,
        chainId: estimate.chainId,
    });
}