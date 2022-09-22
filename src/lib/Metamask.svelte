<script lang="ts">
    import { ethers } from "ethers";
    import type { EthersProvider } from "src/cosmos";
    import { db } from "../db";
    import page from "page";
    import { extractQueryParams } from "./utils";

    import {
        activeAccount,
        activeChain,
        connectedToMetamask,
        web3,
    } from "./stores";
    import type { Unsubscriber } from "svelte/store";
    import { onDestroy } from "svelte";

    web3.set(new ethers.providers.Web3Provider(window.ethereum, "any"));

    const signer = $web3.getSigner();

    export const handleAccountEvent = async (accounts: string[]) => {
        console.log("Handling account event");
        if (!accounts.length) {
            connectedToMetamask.set(false);
            activeAccount.set(null);
            activeChain.set(null);
            return;
        }

        if ($activeAccount !== accounts[0]) {
            activeAccount.set(accounts[0]);
        }

        const chainId = await signer.getChainId();
        
        const dbExists = !!(await db.chains.get(chainId))
        if (!dbExists) {
            db.chains.add({
                id: chainId,
                blocks: []
            })
        }

        connectedToMetamask.set(true);
        activeChain.set(chainId);
    };

    export const handleChainEvent = async (chainId: number) => {
        if ($activeChain !== chainId) {
            window.location.reload();
        }
    };

    const connect = async () => {
        try {
            await $web3.send("eth_requestAccounts", []);
            const accounts = await $web3.listAccounts();
            return handleAccountEvent(accounts);
        } catch (e) {
            if (e.code === 4001) {
                console.log("Metamask is not connected...");
            } else {
                console.log(e);
            }
        }
    };

    ($web3.provider as EthersProvider)
        .on("accountsChanged", handleAccountEvent)
        .on("chainChanged", handleChainEvent)
        .on("disconnect", handleAccountEvent);

    $web3
        .listAccounts()
        .then(handleAccountEvent)
        .catch((e) => {
            console.error(e);
        });

    const unsubscribe = connectedToMetamask.subscribe((connected: boolean) => {
        const queryParams = extractQueryParams();
        const redirect = queryParams.redirect || "/explorer";
        if(connected) {
            page.redirect(redirect);
            
        }
    })

    onDestroy(unsubscribe)
</script>

<main>
    {#if !$connectedToMetamask}
        <!-- TODO: Handle cases where the Metamask notification is already active and the user clicks on the button again -->
        <button on:click={connect}>Connect</button>
    {/if}
</main>
