# How to use NFT Subscriptions to protect Smart Contracts?

## Introduction

In this tutorial we are gonna show how to create a simple Smart Contract that exposes some functions only to users that have a valid Nevermined NFT Subscription.

For the Smart Contract development we are gonna use Hardhat, but you can use any other framework.

## Getting Started

You need to have hardhat installed in your machine. If you don't have it please follow the [installation guide](https://hardhat.org/getting-started/#installation).

To run the tests you need to have a [Infura](https://infura.io/) account. In the test we are gonna connect to the Arbitrum Sepolia network where we deployed the NFT Subscription Smart Contract via the [Nevermined App](https://testing.nevermined.app/).

Running the tests:

```bash
export WEB3_URL=https://sepolia-rollup.arbitrum.io/rpc
npx hardhat node --fork $WEB3_URL
yarn test
```

## Using your NFT Subscription

If you want to use your own NFT subscription to test the process you can create a new one via the [Nevermined App](https://testing.nevermined.app/). Once you have it please get the NFT Contract address and run the test with the following environment variable:

```bash
export NFT_CONTRACT_ADDRESS="0x1bcA156f746C6Eb8b18d61654293e2Fc5b653fF5"
```

## Purchasing a NFT Subscription

To do a proper test the subscriber account should go to the testing environment and purchase a NFT Subscription. In our test we purchased the following NFT Subscription:

```bash
https://testing.nevermined.app/en/subscription/did:nv:54c76f49dcfde63b1ce75412a3105bfb702b3e123a7e61320937f0ca792736e7
```

The `tokenId` is the last part of the URL (after `did:nv:`): `54c76f49dcfde63b1ce75412a3105bfb702b3e123a7e61320937f0ca792736e7`. Export that value as an environment variable:

```bash
export NFT_TOKEN_ID=54c76f49dcfde63b1ce75412a3105bfb702b3e123a7e61320937f0ca792736e7
```

## Impersonating the subscriber account

In the test we are impersonating the Subscriber account. If you want to test with a different account subscribed to the above NFT Subscription, you jusct need to export the following environment variable:

```bash
export SUBSCRIBER_ADDRESS="0xf6dA28bEc818F8a823ea25a8C2e785f1D07913af"
```
