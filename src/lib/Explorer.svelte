<script lang="ts">
    import type { BlockWithTransactions } from "@ethersproject/abstract-provider";
    import { web3 } from "./stores";

    let blocks: BlockWithTransactions[];

    const queryBlocks = async (): Promise<BlockWithTransactions[]> => {
        try {
            blocks = [];

            const blockNumber = await $web3.getBlockNumber();
            for (let i = 0; i < blockNumber; i++) {
                const b: BlockWithTransactions = await $web3.getBlockWithTransactions(i);
                blocks.push(b);
            }
            return blocks
        } catch (e) {
            console.error(e);
            return [];
        }
    };
</script>

<main class="main-bg flex flex-col h-screen">
    {#await queryBlocks()}
        Loading...
    {:then blocks}
        {#each blocks as block}
            <div class="border-black border-double">
                { block.hash }
            </div>
        {/each} 
    {/await}
    
</main>

<style>
    .main-bg {
        background: linear-gradient(180deg, #283e51 0%, #0a2342 100%);
    }
</style>
