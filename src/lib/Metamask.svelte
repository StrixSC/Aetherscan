<script lang="ts">
    import { ethers } from "ethers";
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const req = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log("Account:", await signer.getAddress());
    }
</script>

<main>
    <button on:click|once="{connect}">Connect</button>
</main>
