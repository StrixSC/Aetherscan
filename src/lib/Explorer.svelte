<script lang="ts">
    import type {
        BlockWithTransactions,
        TransactionResponse,
    } from "@ethersproject/abstract-provider";
    import { web3, constants, activeChain } from "./stores";
    import { db } from "../db";
    import moment from "moment";
    import page from "page";
    import { BigNumber } from "ethers";
    import { extractQueryParams } from "./utils";

    if (!$activeChain) {
        page.redirect(`/?redirect=${page.current}`);
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
                pageCount = latestBlock/maxBlocks;
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
                                                {BigNumber.from(block.gasUsed)}
                                            </td>
                                            <td
                                                class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                                            >
                                                {BigNumber.from(block.gasLimit)}
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
        <br />
        <div class="flex justify-center">
            <nav aria-label="Page navigation example">
                <ul class="flex list-style-none">
                    <li class="page-item" class:disabled="{currentPage === 1}">
                        <a
                            class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 focus:shadow-none"
                            href="#">Previous</a
                        >
                    </li>
                    {#each Array(pageCount) as _, i}
                        <li class="page-item" class:active="{currentPage === i}">
                            <a class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                                href="#">
                                {i + 1}  
                                {#if currentPage === 1}
                                    <span class="visually-hidden">(current)</span>
                                {/if}
                        </a>
                        </li>
                    {/each}
                    <li class="page-item" class:disabled="{currentPage === pageCount}">
                        <a
                            class="page-link relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href="#">Next</a
                        >
                    </li>
                </ul>
            </nav>
        </div>
    {/if}
</main>


<style>
    .main-bg {
        background: linear-gradient(180deg, #283e51 0%, #0a2342 100%);
    }
    
</style>
