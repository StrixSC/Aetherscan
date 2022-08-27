<script lang="ts">
    import { ethers } from "ethers";
import type { EthersProvider } from "src/cosmos";
    import {
        activeAccount,
        activeChain,
        connectedToMetamask,
        web3,
    } from "./stores";

    web3.set(new ethers.providers.Web3Provider(window.ethereum, "any"));

    console.log($web3.provider);
    const signer = $web3.getSigner();


    activeAccount.subscribe((c) => {
        console.log(c);
    });

    export const handleAccountEvent = async (accounts: string[]) => {
        console.log("Handling account event");
        if (!accounts.length) {
            connectedToMetamask.set(false);
            activeAccount.set(null);
            activeChain.set(null);
            return;
        }

        if($activeAccount !== accounts[0]) {
            activeAccount.set(accounts[0]);
        }

        const chainId = await signer.getChainId();
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
            return handleAccountEvent(accounts)
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

    $web3.listAccounts()
        .then(handleAccountEvent)
        .catch((e) => {
            console.error(e);
        });
</script>

<main>
    {#if $connectedToMetamask}
        <p>Connected to {$activeAccount} at the chainId: {$activeChain}</p>
    {:else}
        <button on:click={connect}>Connect</button>
    {/if}
</main>
