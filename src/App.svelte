<script lang="ts">
  import Metamask from "/src/lib/Metamask.svelte";
  import NoMetamask from "/src/lib/NoMetamask.svelte";
  import NoWallet from "/src/lib/NoWallet.svelte";

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
