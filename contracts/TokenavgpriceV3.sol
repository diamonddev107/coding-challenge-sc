//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "hardhat/console.sol";

contract TokenavgpriceV3 is Pausable, Initializable {

    address admin;
    mapping(address => uint[]) prices; // Suppose index 0 : 2022.01.01
    
    function setAdmin() public {
        admin = msg.sender;
    }
    
    function setDayPrice(address token, uint256 price) onlyOwner external {
        require(token != address(0), "Invalid token address");
        prices[token].push(price);
    }

    function updateDayPrice(address token, uint256 index, uint256 price) onlyOwner external {
        prices[token][index] = price;
    }

    function getDayPrice(address token, uint256 index) external view returns (uint256) {
        return prices[token][index];
    }

    function getAvgPrice(address token, uint256 indexSt, uint256 indexEnd) external view returns (uint256) {
        uint avgPrice = prices[token][indexSt];
        for(uint i = indexSt+1; i < indexEnd; i++){
            avgPrice += prices[token][i];
        }
        avgPrice /= indexEnd - indexSt + 1;
        return avgPrice;
    }
    modifier onlyOwner() {
        require(msg.sender == admin, "Not admin");
        _;
    }

}
