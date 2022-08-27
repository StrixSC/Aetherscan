<script lang="ts">
  import Metamask from "./lib/Metamask.svelte";
  import NoMetamask from "./lib/NoMetamask.svelte";
  import NoWallet from "./lib/NoWallet.svelte";

  const hasProvider = !!window.ethereum;
  const isMetamask = hasProvider && !window.ethereum.isMetamask;
</script>

<main>
  {#if hasProvider && isMetamask}
    <Metamask />
  {:else if hasProvider && !isMetamask}
    <NoMetamask />
  {:else}
    <NoWallet />
  {/if}
</main>

<style>
</style>
