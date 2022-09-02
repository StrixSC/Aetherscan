<script lang="ts">
    import { ethers } from "ethers";
    import router from "page";
    import type { EthersProvider } from "src/cosmos";
    import Explorer from "./Explorer.svelte";

    import {
        activeAccount,
        activeChain,
        connectedToMetamask,
        web3,
    } from "./stores";

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

    let blocks = [];

    

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
</script>

<main>
    {#if $connectedToMetamask}
        <Explorer />
    {:else}
        <!-- TODO: Handle cases where the Metamask notification is already active and the user clicks on the button again -->
        <button on:click={connect}>Connect</button>
    {/if}
</main>
