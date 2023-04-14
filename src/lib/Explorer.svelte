<script>
    import LeftNavbar from "./LeftNavbar.svelte";
    import Metamask from "./Metamask.svelte"
    import NoMetamask from "./NoMetamask.svelte"
    import NoWallet from "./NoWallet.svelte"
    const hasProvider = !!window.ethereum;
    const isMetamask = hasProvider && !window.ethereum.isMetamask;
    import { connectedToMetamask } from "./stores";
</script>

<main class="flex flex-row gap-4">
    
    {#if hasProvider && isMetamask}
        {#if !$connectedToMetamask}
            <Metamask></Metamask>
        {:else}
            <LeftNavbar></LeftNavbar>
            <h1> connected </h1>
        {/if}
    {:else if hasProvider && !isMetamask}
        <NoMetamask></NoMetamask>
    {:else}
        <NoWallet></NoWallet>
    {/if}
</main>