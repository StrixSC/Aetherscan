<script lang="ts">
  import Metamask from "./lib/Metamask.svelte";
  import NoMetamask from "./lib/NoMetamask.svelte";
  import NoWallet from "./lib/NoWallet.svelte";
  import Explorer from "./lib/Explorer.svelte";
  import router from "page";
  import { page } from "./lib/stores";

  const hasProvider = !!window.ethereum;
  const isMetamask = hasProvider && !window.ethereum.isMetamask;

  
  router("/", () => {
    if (hasProvider && isMetamask) {
      $page = Metamask
    } else if (hasProvider && !isMetamask) {
      $page = NoMetamask
    } else {
      $page = NoWallet
    }
  });

  router("/explorer", () => $page = Explorer);
  // router("/explorer/:block", (ctx, next) => {
  //   $params = ctx.params;
  //   next()
  // }, () => $page = Explorer);


  router.start();
</script>

<main>
  <svelte:component this={$page} />
</main>

<style>
</style>
