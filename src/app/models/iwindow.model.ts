import { MetaMaskInpageProvider } from "@metamask/providers";

export default interface IWindow extends Window {
  ethereum: MetaMaskInpageProvider;
}
