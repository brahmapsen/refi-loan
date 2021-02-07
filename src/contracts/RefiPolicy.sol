pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20  } from "./Interfaces.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RefiPolicy is ChainlinkClient, Ownable {
    //state variable that will stored
    string public name = "refi";
    
    address[] public stakers;
    // token > address
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] allowedTokens;
    uint public totalAaveToken = 3100;

    //refi variables
    address[] public depositors;

    //List of delegatee for a particular creditor
    mapping(address => address[]) public delegatee;
    

    constructor() public {
    }

    function addAllowedTokens(address token) public onlyOwner {
        allowedTokens.push(token);
    }

    function setPriceFeedContract(address token, address priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[token] = priceFeed;
    }

    function stakeTokens(uint256 _amount, address token) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");
        if (tokenIsAllowed(token)) {
            updateUniqueTokensStaked(msg.sender, token);
            IERC20(token).transferFrom(msg.sender, address(this), _amount);
            stakingBalance[token][msg.sender] =
                stakingBalance[token][msg.sender] +
                _amount;
            if (uniqueTokensStaked[msg.sender] == 1) {
                stakers.push(msg.sender);
            }
        }
    }

    function updateUniqueTokensStaked(address user, address token) internal {
        if (stakingBalance[token][user] <= 0) {
            uniqueTokensStaked[user] = uniqueTokensStaked[user] + 1;
        }
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens(address token) public {
        // Fetch staking balance
        uint256 balance = stakingBalance[token][msg.sender];
        require(balance > 0, "staking balance cannot be 0");
        IERC20(token).transfer(msg.sender, balance);
        stakingBalance[token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    function tokenIsAllowed(address token) public view returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == token) {
                return true;
            }
        }
        return false;
    }

    function getTokenEthPrice(address token) public view returns (uint256) {
        address priceFeedAddress = tokenPriceFeedMapping[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface( priceFeedAddress);
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        return uint256(price);
    }

    //refi routines
    function addDelegatee(address _creditor, address _delegatee) public {
        depositors.push(_creditor);
        delegatee[_creditor].push(_delegatee);
    }

    function getDelegatee(address _creditor) public view returns (address [] memory ) {
        return delegatee[_creditor];
    }

    function getDepositors() public view returns (address [] memory) {
        return depositors;
    }


}

