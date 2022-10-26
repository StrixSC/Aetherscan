import type { BlockWithTransactions } from '@ethersproject/abstract-provider'
import { web3 } from "./stores";

export const extractQueryParams = (): Record<string, any> => {
    return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop: any) => searchParams.get(prop),
    });
};

// Taken directly from https://github.com/processing/p5.js/blob/main/src/math/calculation.js
export const constrain = (n:number , low: number, high: number): number => {
    return Math.max(Math.min(n, high), low);
}

export const mergeBlocks = (blockArray1: BlockWithTransactions[], blockArray2: BlockWithTransactions[]) => {
    const temp: BlockWithTransactions[] = blockArray1.concat(blockArray2); 
    const allBlocks = new Map<number, number>();
    const result = [];

    for(let index = 0; index < temp.length; index++) {
        const block = temp[index];
        if (allBlocks.has(block.number)) {
            continue;
        }
        
        allBlocks.set(block.number, index);
        result.push(block);

    }
    
    return result;
}
