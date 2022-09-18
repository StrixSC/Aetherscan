import { writable } from "svelte/store";
import type { ethers } from "ethers";

export const constants: Record<string, string> = {
    db: "cosmos",
}

export const activeAccount = writable<string>(null);
export const activeChain = writable<number>(null);
export const connectedToMetamask = writable<boolean>(false);
export const web3 = writable<ethers.providers.Web3Provider>(null);