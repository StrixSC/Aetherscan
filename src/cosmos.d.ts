import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
    interface Window{
        ethereum: ExternalProvider
    }
}

type ExtensionForProvider = {
    on: (event: string, callback: (...params: any) => void) => void;
}

type EthersProvider = ExternalProvider & ExtensionForProvider;
