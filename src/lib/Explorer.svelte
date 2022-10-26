<script lang="ts">
    import type { BlockWithTransactions } from "@ethersproject/abstract-provider";
    import { web3, activeChain } from "./stores";
    import { db } from "../db";
    import moment from "moment";
    import page from "page";
    import { BigNumber } from "ethers";
    import { extractQueryParams } from "./utils";

    if (!$activeChain) {
        page.redirect(`/?redirect=${encodeURIComponent(page.current)}`)
    }

    let pageCount = 0;
    let currentPage = 0;

    const queryParams: Record<string, any> = extractQueryParams();
    const queryStartBlock = queryParams.start;

    let blocks: BlockWithTransactions[];

    const queryBlocks = async () => {
        let blocks = [];
        const chainData = await db.chains.where({ id: $activeChain }).first();

        try {
            if (chainData.blocks.length > 0) {
                blocks = chainData.blocks;
                let newBlocks = [];
                const previouslyFetchedBlockLength =
                    chainData.blocks.length - 1;
                const lastFetchedBlock =
                    chainData.blocks[previouslyFetchedBlockLength].number;
                newBlocks = await queryBlocksFromBlockchain(
                    lastFetchedBlock + 1
                );
                blocks = blocks.concat(newBlocks);
            } else {
                blocks = await queryBlocksFromBlockchain();
            }
        } catch (e) {
            blocks = [];
            console.error(e);
        }

        await db.chains.update($activeChain, { id: $activeChain, blocks });
        return blocks;
    };

    const queryBlocksFromBlockchain = async (
        startingBlock = queryStartBlock || 0,
        maxBlocks = 50
    ): Promise<BlockWithTransactions[]> => {
        try {
            const blocks = [];

            if (startingBlock !== 0) {
                const latestBlock = await $web3.getBlockNumber();
                pageCount = latestBlock / maxBlocks;
                currentPage = 1;
                if (latestBlock < startingBlock) {
                    return [];
                }
            }

            for (let i = startingBlock; i < maxBlocks; i++) {
                const b: BlockWithTransactions =
                    await $web3.getBlockWithTransactions(i);
                blocks.push(b);
            }

            return blocks.map((b: BlockWithTransactions) => {
                return {
                    ...b,
                    transactions: b.transactions.map((t) => {
                        delete t.wait;
                        return t;
                    }),
                };
            });
        } catch (e) {
            console.error(e);
            return [];
        }
    };
</script>

<main>
    {#if $activeChain}
        {#await queryBlocks()}
            Loading...
        {:then blocks}
            <div class="flex justify-center">
                <nav>
                    <ul class="flex list-style-none gap-2">
                        <li>
                            <a href="#">Previous</a>
                        </li>
                        {#each Array(pageCount) as _, i}
                            <li class:font-bold={currentPage === i + 1}>
                                <a href="#"> {i + 1} </a>
                            </li>
                        {/each}
                        <li>
                            <a href="#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="overflow-x-auto relative">
                <table>
                    <thead>
                        <tr>
                            <th> Block </th>
                            <th> Age </th>
                            <th> Txn </th>
                            <th> Miner </th>
                            <th> Gas Used </th>
                            <th> Gas Limit </th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each blocks as block}
                            <tr>
                                <th>
                                    {block.number}
                                </th>
                                <td>
                                    {moment
                                        .unix(block.timestamp)
                                        .format("MM/DD/YYYY HH:mm:SS:ss")}
                                </td>
                                <td>
                                    {block.transactions.length}
                                </td>
                                <td>
                                    {block.miner}
                                </td>
                                <td>
                                    {BigNumber.from(block.gasUsed)}
                                </td>
                                <td>
                                    {BigNumber.from(block.gasLimit)}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/await}
        <br />

    {/if}
</main>

<style>
    .main-bg {
        background: linear-gradient(180deg, #283e51 0%, #0a2342 100%);
    }
</style>
