import { writable } from "svelte/store";
import type { ethers } from "ethers";
import type { SvelteComponent } from "svelte";

export const constants: Record<string, string> = {
    db: "cosmos",
}

export const activeAccount = writable<string>(null);
export const activeChain = writable<number>(null);
export const connectedToMetamask = writable<boolean>(false);
export const page = writable<ConstructorOfATypedSvelteComponent>();
export const queryParams = writable<Record<string, string>>({});
export const web3 = writable<ethers.providers.Web3Provider>(null);