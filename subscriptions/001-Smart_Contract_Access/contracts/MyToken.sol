//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// This is the main building block for smart contracts.
contract MyToken is ERC20 {    


    // An address type variable is used to store ethereum accounts.
    address public owner;

    // The Smart Contract address of the Subscription NFT
    address public subscriptionNFTAddress;

    IERC721 private subscriptionNFT;

    // A mapping is a key/value map. Here we store each account's balance.
    mapping(address => uint256) giveAwayBalances;

    event Claimed(address indexed _who, uint256 _amount);

    modifier onlySubscribers(address _address) {
        require(
            subscriptionNFT.balanceOf(_address) > 0,
            'You are not a subscriber'
        );
        _;
    }

    /**
     * Contract initialization.
     */
    constructor(address nftContract) ERC20("MyToken", "NVM") {
        _mint(msg.sender, 0);
        owner = msg.sender;
        subscriptionNFTAddress = nftContract;
        subscriptionNFT = IERC721(subscriptionNFTAddress);
    }
   
    function claim(uint256 amount) public onlySubscribers(msg.sender) {
        require(giveAwayBalances[msg.sender] >= amount, "You don't have enough tokens to claim");
        giveAwayBalances[msg.sender] -= amount;
        _mint(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }
    
    function claimAll() public onlySubscribers(msg.sender) {
        claim(howMuchCanIClaim());
    }

    function howMuchCanIClaim() public view returns (uint256) {
        return giveAwayBalances[msg.sender];
    }

    function mintGiveAway(address receiver, uint256 amount) public {
        require(msg.sender == owner, "You are not the owner");
        giveAwayBalances[receiver] += amount;
    }
}