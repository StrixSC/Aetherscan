import Ganache, { provider } from "ganache";
import { ethers, BigNumber } from "ethers";
import { expect } from "chai";

describe('Transactions', () => {
    // Mock private key generated with the default seed when running "npm run ganache"
    // Using the following mnemonic:
    // wide slot strike will police already upset increase uncle peasant scheme buffalo
    const privateKey = "0x878386eae4268849d12d2063b07a31f87f05656f7224ed3ab0e07c2b2dbf208c";
    const web3 = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    const signer = new ethers.Wallet(privateKey, web3);
    
    beforeEach(async () => {
        const balance = await signer.getBalance();
        if(BigNumber.from(0) == balance) {
            process.exit(-1);
        }
    })
    
    it('Should generate mock transactions', async () => {
        const TRANSACTION_COUNT = 50;
        const sender = signer.address;
        const receiver = "0x1bA33293E4863e4aba9359FD2E917cf8Aa735EdA"
        const tx = { from: sender, to: receiver, value: ethers.utils.parseUnits("0.001", "ether") };
        for(let i = 0; i < TRANSACTION_COUNT; i++) 
        {
            try {
                const txHash = await signer.sendTransaction(tx);
                const receipt = await txHash.wait();
                console.log("Signed tx: ", receipt.transactionHash);
            } catch (e) {
                console.error(e);
                return;
            }
        }

        const transactionCount = await web3.getTransactionCount(sender);
        expect(transactionCount).to.equal(TRANSACTION_COUNT);
    }).timeout(100000)
});