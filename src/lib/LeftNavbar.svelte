<script>
    import { link } from "svelte-spa-router"
</script>

<div class="flex flex-col align-middle">
    <div class="flex flex-col align-middle justify-center py-4">
        Aetherscan
    </div>
    <ul>
        <li 
            class="flex hover:cursor-pointer flex-row gap-4">
            <i
                class="flex justify-center flex-col align-center fa-solid fa-home text-xs text-headline-navy"
            />
            <a href="/" use:link>Home</a>
        </li>
        <li 
            class="flex hover:cursor-pointer flex-row gap-4">
            <i
                class="flex justify-center flex-col align-center fa-solid fa-cubes text-xs text-headline-navy"
            />
            <a href="/explorer/blocks" use:link>Blocks</a>
        </li>
    </ul>
</div>
