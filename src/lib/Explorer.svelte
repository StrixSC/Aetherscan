<script>
    import LeftNavbar from "./LeftNavbar.svelte";
    import Metamask from "./Metamask.svelte"
    import NoMetamask from "./NoMetamask.svelte"
    import NoWallet from "./NoWallet.svelte"
    import { extractQueryParams } from "./utils";
    const hasProvider = !!window.ethereum;
    const isMetamask = hasProvider && !window.ethereum.isMetamask;
    import { connectedToMetamask } from "./stores";
    import { push, querystring, replace } from "svelte-spa-router"
    import { parse } from 'qs';
    import { onDestroy } from "svelte"
 
    $: parsed = parse($querystring)

    const unsubscribe = connectedToMetamask.subscribe((event) => {
        if (event && parsed) {
            if (parsed.redirect) {
                push(parsed.redirect)
            }
        }
    })

    onDestroy(unsubscribe);
</script>

<main class="flex flex-row gap-4">
    
    {#if hasProvider && isMetamask}
        {#if !$connectedToMetamask}
            <Metamask></Metamask>
        {:else}
            <LeftNavbar></LeftNavbar>
        {/if}
    {:else if hasProvider && !isMetamask}
        <NoMetamask></NoMetamask>
    {:else}
        <NoWallet></NoWallet>
    {/if}
</main>