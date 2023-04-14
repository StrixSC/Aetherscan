import Explorer from "./Explorer.svelte";
import Blocks from "./Blocks.svelte";
import Landing from "./Landing.svelte";
import NotFound from "./NotFound.svelte";
import Transactions from "./Transactions.svelte";
import Transaction from "./Transaction.svelte";
import Block from "./Block.svelte";

export const routes = {
    '/': Landing,
    '/explorer': Explorer,
    '/explorer/blocks': Blocks,
    '/explorer/blocks/:id': Block,
    '/explorer/transactions': Transactions,
    '/explorer/transactions/:id': Transaction,
    '*': NotFound,
}