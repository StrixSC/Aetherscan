<script>
    import { onMount } from 'svelte'
    import LeftNavbar from './LeftNavbar.svelte'
    import { activeChain, web3, connectedToMetamask } from './stores'
    import { replace, location } from 'svelte-spa-router'

    if (!$activeChain) {
        replace(`/explorer?redirect=${encodeURIComponent($location)}`)
    }

    export let params = {}
    const hash = params.id
    if (!hash) {
        replace('/explorer')
    }
</script>

<div class="flex">
    {#if $connectedToMetamask}
        <LeftNavbar />
        {#await $web3.getBlockWithTransactions(hash)}
            <div>Loading...</div>
        {:then block}
            {#each block.transactions as transaction}
                <div>transaction is: {transaction.hash}</div>
            {/each}
        {/await}
    {/if}
</div>
