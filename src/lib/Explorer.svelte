<script lang="ts">
    import LeftNavbar from './LeftNavbar.svelte';

    import type { BlockWithTransactions } from '@ethersproject/abstract-provider';
    import { web3, activeChain } from './stores';
    import { db, type Chain } from '../db';
    import moment from 'moment';
    import page from 'page';
    import { BigNumber } from 'ethers';
    import { extractQueryParams, mergeBlocks } from './utils';

    if (!$activeChain) {
        page.redirect(`/?redirect=${encodeURIComponent(page.current)}`)
    }

    export const getLatestBlock = async () => {
        try {
            const latestBlockInBlockChain = await $web3.getBlockNumber();
            return latestBlockInBlockChain;
        } catch (e) {
            console.error(e)
            return 0;
        }
    }

    let pageCount = 1
    let currentPage = 0

    // TODO: ADD FILTERS TO MAKE SURE THAT PEOPLE DONT GO OVER THE LIMITS.
    const queryParams: Record<string, any> = extractQueryParams()
    const queryStartBlock = parseInt(queryParams.start, 10) || 0
    const queryLimit = parseInt(queryParams.limit, 10) || 50

    let blocks: BlockWithTransactions[] = []

    const saveBlocksToCache = async (
        chainData: Chain,
        blocks: BlockWithTransactions[],
        startIndex: number = -1,
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
        
        return blocks.splice(queryStartBlock, queryLimit + 1);
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

        const latestBlockInBlockchain = await getLatestBlock();
        if (latestBlockInBlockchain < start + limit) {
            limit = latestBlockInBlockchain - start;
        }

        if (!chainData || chainData.blocks.length === 0 || startIndex === -1) {
            blocks = await queryBlocksFromBlockchain(start, limit);
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

<main>
    <LeftNavbar></LeftNavbar>
    {#if $activeChain}
        {#await qBlocks()}
            Loading...
        {:then blocks}
            <div class="flex justify-center">
                <nav>
                    <ul class="flex list-style-none gap-2">
                        <li>
                            <a href="#">Previous</a>
                        </li>
                        <li>
                            <a href="#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="overflow-x-auto relative">
                <table class="flex flex-col gap-1">
                    <caption class="flex justify-start font-inter">Blocks</caption>
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
                                        .format('MM/DD/YYYY HH:mm:SS:ss')}
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
