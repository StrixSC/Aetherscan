import Explorer from "./Explorer.svelte";
import Blocks from "./Blocks.svelte";
import Landing from "./Landing.svelte";
import NotFound from "./NotFound.svelte";

export const routes = {
    '/': Landing,
    '/explorer': Explorer,
    '/explorer/blocks': Blocks,
    '*': NotFound,
}