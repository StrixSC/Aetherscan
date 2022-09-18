<script lang="ts">
    import type {
        BlockWithTransactions,
        TransactionResponse,
    } from "@ethersproject/abstract-provider";
    import { web3, constants, activeChain } from "./stores";
    import { db } from "../db";
    import moment from "moment";

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

        console.log(blocks);

        await db.chains.update($activeChain, {
            blocks: blocks.map((b: BlockWithTransactions) => {
                return {
                    ...b,
                    transactions: b.transactions.map((t: TransactionResponse) => {
                        return {
                            ...t,
                            wait: null,
                        };
                    }),
                };
            }),
        });

        return blocks;
    };

    const queryBlocksFromBlockchain = async (
        startingBlock = 0,
        maxBlocks = 50
    ): Promise<BlockWithTransactions[]> => {
        try {
            const blocks = [];

            if (startingBlock !== 0) {
                const latestBlock = await $web3.getBlockNumber();
                if (latestBlock == startingBlock) {
                    return []
                }
            }

            for (let i = startingBlock; i < maxBlocks; i++) {
                const b: BlockWithTransactions =
                    await $web3.getBlockWithTransactions(i);
                blocks.push(b);
            }

            return blocks;
        } catch (e) {
            console.error(e);
            return [];
        }
    };
</script>

<main>
    {#await queryBlocks()}
        Loading...
    {:then blocks}
        <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <table class="min-w-full">
                            <thead class="border-b">
                                <tr>
                                    <th
                                        scope="col"
                                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                        Block
                                    </th>
                                    <th
                                        scope="col"
                                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                        Age
                                    </th>
                                    <th
                                        scope="col"
                                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                        Txn
                                    </th>
                                    <th
                                        scope="col"
                                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                        Miner
                                    </th>
                                    <th
                                        scope="col"
                                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                        Gas Used
                                    </th>
                                    <th
                                        scope="col"
                                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                    >
                                        Gas Limit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each blocks as block}
                                    <tr class="bg-white border-b">
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                        >
                                            {block.number}
                                        </td>
                                        <td
                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                        >
                                            {moment
                                                .unix(block.timestamp)
                                                .format(
                                                    "MM/DD/YYYY HH:mm:SS:ss"
                                                )}
                                        </td>
                                        <td
                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                        >
                                            {block.transactions.length}
                                        </td>
                                        <td
                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                        >
                                            {block.miner}
                                        </td>
                                        <td
                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                        >
                                            {block.gasUsed}
                                        </td>
                                        <td
                                            class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                        >
                                            {block.gasLimit}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    {/await}
</main>

<style>
    .main-bg {
        background: linear-gradient(180deg, #283e51 0%, #0a2342 100%);
    }
</style>
