<script lang="ts">
    import type { BlockWithTransactions } from '@ethersproject/abstract-provider'
    import { web3, activeChain } from './stores'
    import { db, type Chain } from '../db'
    import moment from 'moment'
    import { push, pop, replace, location, link } from "svelte-spa-router";
    import { BigNumber } from 'ethers'
    import { extractQueryParams, mergeBlocks } from './utils'
    import LeftNavbar from './LeftNavbar.svelte'

    if (!$activeChain) {
        replace(`/explorer?redirect=${encodeURIComponent($location)}`)
    }

    export const getLatestBlock = async () => {
        try {
            const latestBlockInBlockChain = await $web3.getBlockNumber()
            return latestBlockInBlockChain
        } catch (e) {
            console.error(e)
            return 0
        }
    }

    let pageCount = 1
    let currentPage = 0

    // TODO: ADD FILTERS TO MAKE SURE THAT PEOPLE DONT GO OVER THE LIMITS.
    const queryStartBlock =  0;
    const queryLimit =  50;

    const saveBlocksToCache = async (
        chainData: Chain,
        blocks: BlockWithTransactions[],
        startIndex: number = -1
    ) => {
        blocks = blocks.map((b: BlockWithTransactions) => {
            return {
                ...b,
                transactions: b.transactions.map((t) => {
                    if (t.wait) {
                        delete t.wait
                    }
                    return t
                }),
            }
        })

        try {
            if (startIndex !== -1) {
                blocks = mergeBlocks(chainData.blocks, blocks)
            }

            const sortedBlocks = blocks.sort((b1, b2) => {
                return b1.number - b2.number
            })

            await db.chains.update($activeChain, { blocks: sortedBlocks })
        } catch (e) {
            console.error(e)
        }

        return blocks.splice(queryStartBlock, queryLimit + 1)
    }

    const qBlocks = async (
        start = queryStartBlock,
        limit = queryLimit
    ): Promise<BlockWithTransactions[]> => {
        let blocks = []
        const chainData = await db.chains.where({ id: $activeChain }).first()
        const startIndex = chainData
            ? chainData.blocks.findIndex((b) => b.number === start)
            : -1

        const latestBlockInBlockchain = await getLatestBlock()
        if (latestBlockInBlockchain < start + limit) {
            limit = latestBlockInBlockchain - start
        }

        if (!chainData || chainData.blocks.length === 0 || startIndex === -1) {
            blocks = await queryBlocksFromBlockchain(start, limit)
        } else {
            const lastBlockInCache =
                chainData.blocks[chainData.blocks.length - 1].number

            if (start > lastBlockInCache) {
                blocks = await queryBlocksFromBlockchain(start, limit)
            } else if (start + limit <= lastBlockInCache) {
                const startingIndex = chainData.blocks.findIndex(
                    (b) => b.number === start
                )
                blocks = chainData.blocks.splice(
                    startingIndex,
                    startingIndex + limit + 1
                )
                return blocks
            } else {
                blocks = chainData.blocks.splice(start, lastBlockInCache)
                console.log(
                    'Fetching from ',
                    lastBlockInCache,
                    'this many blocks:',
                    limit - (lastBlockInCache - start)
                )
                const newBlocks = await queryBlocksFromBlockchain(
                    lastBlockInCache + 1,
                    limit - (lastBlockInCache - start)
                )
                blocks = blocks.concat(newBlocks)
            }
        }

        return saveBlocksToCache(chainData, blocks, startIndex)
    }

    const queryBlocksFromBlockchain = async (
        startingBlock = queryStartBlock,
        maxBlocks = queryLimit,
        blockNumberList: number[] = []
    ): Promise<BlockWithTransactions[]> => {
        try {
            let blocks = []

            if (blockNumberList.length != 0) {
                for (const blockNum of blockNumberList) {
                    const b: BlockWithTransactions =
                        await $web3.getBlockWithTransactions(blockNum)
                    if (b) {
                        blocks.push(b)
                    }
                }

                return blocks
            }

            if (startingBlock !== 0) {
                const latestBlock = await $web3.getBlockNumber()
                pageCount = latestBlock / maxBlocks
                currentPage = 1
                if (latestBlock < startingBlock) {
                    return []
                }
            }

            for (let i = startingBlock; i <= startingBlock + maxBlocks; i++) {
                const b: BlockWithTransactions =
                    await $web3.getBlockWithTransactions(i)
                if (b) {
                    blocks.push(b)
                }
            }

            return blocks
        } catch (e) {
            console.error(e)
            return []
        }
    }
</script>

<main class="flex justify-start gap-1">
    <LeftNavbar></LeftNavbar>
    {#if $activeChain}
        {#await qBlocks()}
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.6424 8.35284H8.40812L11.8941 11.8388C12.0273 11.972 12.2466 11.9828 12.3835 11.8538C13.2372 11.0495 13.8244 9.96533 13.9967 8.74658C14.0263 8.53791 13.8531 8.35284 13.6424 8.35284ZM13.2932 6.92343C13.1115 4.28829 11.0058 2.18256 8.37062 2.0008C8.16944 1.9869 8.00003 2.15653 8.00003 2.35815V7.29401H12.9361C13.1377 7.29401 13.3071 7.1246 13.2932 6.92343ZM6.94121 8.35284V3.11851C6.94121 2.90785 6.75614 2.73469 6.54768 2.76425C3.91894 3.13572 1.90961 5.43226 2.00314 8.18453C2.09931 11.0111 4.53305 13.3291 7.36099 13.2936C8.47275 13.2797 9.50002 12.9214 10.3447 12.3223C10.5189 12.1988 10.5304 11.9422 10.3793 11.7911L6.94121 8.35284Z"
                    fill="black"
                />
            </svg>

            Loading...
        {:then blocks}
            <div class="overflow-x-auto relative">
                <div class="p-3 table-header flex justify-between">
                    <h2 class="flex justify-start font-bold">Mined Blocks</h2>
                    <div
                        class="table-utilities flex justify-center align-center"
                    >
                        <div
                            class="search-icon-container pr-2 border-r border-gray-150 align-center justify-center flex hover:cursor-pointer"
                        >
                            <i
                                class="text-gray-400 flex justify-center flex-col align-center fa-solid fa-search"
                            />
                        </div>
                        <div
                            class="pl-2 sort-icon-container flex justify-center align-center gap-2"
                        >
                            <i
                                class="flex justify-center flex-col align-center fa-solid fa-chart-pie"
                            />
                            <div
                                class="flex justify-center align-center gap-1 hover:cursor-pointer"
                            >
                                <h2 class="font-bold">Sort by</h2>
                                <i
                                    class="text-gray-400 flex justify-center flex-col align-center fa-solid fa-chevron-down text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <table class="table">
                    <thead>
                        <tr>
                            <th
                                class="text-center p-2 whitespace-nowrap text-xs font-thin uppercase text-headline-light-gray"
                                >Block</th
                            >
                            <th
                                class="text-center p-2 whitespace-nowrap text-xs font-thin uppercase text-headline-light-gray"
                                >Age</th
                            >
                            <th
                                class="text-center p-2 whitespace-nowrap text-xs font-thin uppercase text-headline-light-gray"
                                >Txn</th
                            >
                            <th
                                class="text-center p-2 whitespace-nowrap text-xs font-thin uppercase text-headline-light-gray"
                                >Miner</th
                            >
                            <th
                                class="text-center p-2 whitespace-nowrap text-xs font-thin uppercase text-headline-light-gray"
                                >Gas Used</th
                            >
                            <th
                                class="text-center p-2 whitespace-nowrap text-xs font-thin uppercase text-headline-light-gray"
                                >Gas Limit</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each blocks as block}
                            <tr class="border-b border-gray-150">
                                <th class="text-center p-2 whitespace-nowrap"
                                    >{block.number}</th
                                >
                                <td class="text-center p-2 whitespace-nowrap"
                                    >{moment
                                        .unix(block.timestamp)
                                        .format('MM/DD/YYYY HH:mm:SS:ss')}</td
                                >
                                <td class="text-center p-2 whitespace-nowrap"
                                    >{block.transactions.length}</td
                                >
                                <td class="text-center p-2 whitespace-nowrap"
                                    >{block.miner.substring(0, 8) +
                                        '...' +
                                        block.miner.substring(
                                            block.miner.length - 3,
                                            block.miner.length
                                        )}</td
                                >
                                <td class="text-center p-2 whitespace-nowrap"
                                    >{BigNumber.from(block.gasUsed)}</td
                                >
                                <td class="text-center p-2 whitespace-nowrap"
                                    >{BigNumber.from(block.gasLimit)}</td
                                >
                                <td
                                    class="text-center p-2 whitespace-nowrap underline hover:cursor-pointer"
                                    ><a href="/explorer/blocks/{block.hash}" use:link>View</a></td
                                >
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
    :global(.main-bg) {
        background: linear-gradient(180deg, #283e51 0%, #0a2342 100%);
    }
</style>
