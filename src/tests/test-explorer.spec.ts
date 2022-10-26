import { ethers, BigNumber } from "ethers";
import { expect } from "chai";
import blocks from "./mock-blocks";

describe('Explorer', () => {
    const DEFAULT_TIMEOUT = 1000000;
    let mock_blocks = [...blocks];
    beforeEach(async () => {
        mock_blocks = [];
        console.log(mock_blocks);
    })
    
    /* Skip this test unless we're using it to generate some transactions */
    xit('Should generate mock transactions', async () => {
        
    }).timeout(DEFAULT_TIMEOUT)
});