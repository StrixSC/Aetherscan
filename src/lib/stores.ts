import { writable } from "svelte/store";
import type { ethers } from "ethers";

export const currentSigner = writable();