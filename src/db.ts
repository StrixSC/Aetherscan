import type { BlockWithTransactions } from "@ethersproject/abstract-provider";
import Dexie, { type Table } from "dexie";

export interface Chain {
    id?: number
    blocks: BlockWithTransactions[]
}

export class CosmosDB extends Dexie {
    chains: Table<Chain>

    constructor() {
        super('cosmosdb')
        this.version(1).stores({
            chains: "++id, blocks"
        })
    }

}

export const db = new CosmosDB();