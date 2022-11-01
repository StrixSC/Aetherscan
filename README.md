# Cosmos

## Ethereum Blockchain Explorer

For those times when you dont feel like having to install a snap version of geth to query a private network...

The project is there to provide CTF players or other security researchers a way to quickly search through a private network (think of it like a private etherscan). The primary focus of this application is to be able to bundle it with other projects such as [chainflag/eth-challenge-base](https://github.com/chainflag/eth-challenge-base).

This application is not production ready.

The network must allow *ALL* RPC methods listed [here](https://ethereum.org/en/developers/docs/apis/json-rpc/).
  - 

**Only supports Metamask for now. Support for other HD wallets might happen in the future.**

## Development

Development is really simple, run `npm run dev` to run the vite build tool, run `npm test` to run tests and run `npm run check` to run tsconfig checking with svelte-check. 

The back-end during development is a Ganache private network with the genesis block and the accounts generated with the following mnemonic:

`wide slot strike will police already upset increase uncle peasant scheme buffalo`.

As this is only for testing, any back-end will work fine for testing. However, to remain consistent, it is recommended to use the provided mnemonic.

There is a provided test under `src/tests/transactions.spec.ts` that will auto-generate a number of transactions and have the network mine them in order to allow testing the application.

## TODO (WIP):

- Transactions explorer
- Contract Interaction
- Account explorer
- Gas history dashboard
- Deploy
- UI
  - Front page
  - Connection Page
  - Various explorer pages
  - NoWallet page
- etc.