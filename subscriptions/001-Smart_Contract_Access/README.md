# How to use NFT Subscriptions to protect Smart Contracts?

## Introduction

In this tutorial we are gonna show how to create a simple Smart Contract that exposes some functions only to users that have a valid Nevermined NFT Subscription.

For the Smart Contract development we are gonna use Hardhat, but you can use any other framework.

## Getting Started

You need to have hardhat installed in your machine. If you don't have it please follow the [installation guide](https://hardhat.org/getting-started/#installation).

To run the tests you need to have a [Infura](https://infura.io/) account. In the test we are gonna fork the Polygon network where we deploe the NFT Subscription Smart Contract via the [Nevermined App](https://mumbai.nevermined.app/).

Running the tests:

```bash
export WEB3_URL=https://polygon-mumbai.infura.io/v3/$INFURA_KEY
npx hardhat node --fork $WEB3_URL
yarn test
```

## Using your NFT Subscription

If you want to use your own NFT subscription to test the process you can create a new one via the [Nevermined App](https://mumbai.nevermined.app/). Once you have it please get the NFT Contract address and run the test with the following environment variable:

```bash
export NFT_CONTRACT_ADDRESS="0xec47BC8988a4865bD371ADe72b74A51Afbe42F71"
```

## Impersonating the subscriber account

In the test we are impersonating the Subscriber account. If you want to test with a different account subscribed to the above NFT Subscription, you jusct need to export the following environment variable:

```bash
export SUBSCRIBER_ADDRESS="0x9Aa6E515c64fC46FC8B20bA1Ca7f9B26ff404548"
```
