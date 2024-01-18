import { expect } from "chai";
import { ethers } from "hardhat";
import { MyToken } from "../typechain-types";

describe("MyToken Test", function () {

    // The address of the NFT Subscription contract deployed on Polygon Mumbai
    // You can deploy your own by following the instructions in the README
    const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS || '0x1bcA156f746C6Eb8b18d61654293e2Fc5b653fF5'

    const tokenId = process.env.NFT_TOKEN_ID || '0x54c76f49dcfde63b1ce75412a3105bfb702b3e123a7e61320937f0ca792736e7'

    // The address of the NFT subscriber purchasing the NFT Subscription contract
    // We are impersonation this account to test the contract
    const subscriberAddress = process.env.SUBSCRIBER_ADDRESS || '0xf6dA28bEc818F8a823ea25a8C2e785f1D07913af'

    const giveAwayAmount = 10
    let myToken: MyToken
    let myTokenSomeoneSigner: MyToken
    let myTokenSsubscriberSigner: MyToken
    let owner: any    
    let someone: any
    let subscriber: any

    before(async () => {
        ([owner, someone] = await ethers.getSigners())
        subscriber = await ethers.getImpersonatedSigner(subscriberAddress)
    })

    it("Deployment should assign the total supply of tokens to the owner", async function () {        
    
        const Token = await ethers.getContractFactory("MyToken")    
        myToken = await Token.deploy(nftContractAddress, tokenId)

    })

    describe("Someone random can't do much", function () {

        before(async () => {
            myTokenSomeoneSigner = myToken.connect(someone)
        })

        it("Someone should not have balance to claim", async function () {
            const howMuch = await myTokenSomeoneSigner.howMuchCanIClaim()
            console.log(`How much can I claim? ${howMuch.toString()}`)

            expect(howMuch).to.equal(0)
        })

        it("Someone should not be able to claim anything", async function () {  
            
            await expect(myTokenSomeoneSigner.claimAll())
                .to.be.revertedWith('You are not a subscriber')
        })
    })

    describe("But a subscriber should be able to do stuff", function () {

        before(async () => {
            myTokenSsubscriberSigner = myToken.connect(subscriber)
            await myToken.allocateAirdrop(subscriber.address, giveAwayAmount)
        })
        
        it("A subscriber should have some give away to claim", async function () {
            const howMuch = await myTokenSsubscriberSigner.howMuchCanIClaim()
            console.log(`How much can I (${subscriber.address}) claim? ${howMuch.toString()}`)

            expect(howMuch).to.equal(giveAwayAmount)
        })

        it("A subscriber should be able to claim the give away", async function () {  
            const balanceBefore = await myTokenSsubscriberSigner.balanceOf(subscriber.address)
            await myTokenSsubscriberSigner.claimAll()            
            const balanceAfter = await myTokenSsubscriberSigner.balanceOf(subscriber.address)

            console.log(`Balance before: ${balanceBefore.toString()}`)
            console.log(`Balance after: ${balanceAfter.toString()}`)

            expect(balanceBefore.add(giveAwayAmount)).to.equal(balanceAfter)
        })
    })

})
