import { expect } from "chai";
import { ethers } from "hardhat";
import { MyToken } from "../typechain-types";

describe("MyToken Test", function () {

    // The address of the NFT Subscription contract deployed on Polygon Mumbai
    // You can deploy your own by following the instructions in the README
    const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS || '0xec47BC8988a4865bD371ADe72b74A51Afbe42F71'

    // The address of the NFT subscriber purchasing the NFT Subscription contract
    // We are impersonation this account to test the contract
    const subscriberAddress = process.env.SUBSCRIBER_ADDRESS || '0x9Aa6E515c64fC46FC8B20bA1Ca7f9B26ff404548'

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
        myToken = await Token.deploy(nftContractAddress)

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
            await myToken.mintGiveAway(subscriber.address, giveAwayAmount)
        })
        
        it("A subscriber should have some give away to claim", async function () {
            const howMuch = await myTokenSsubscriberSigner.howMuchCanIClaim()
            console.log(`How much can I claim? ${howMuch.toString()}`)

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
