
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingContract1732184642 is ReentrancyGuard {
    using SafeMath for uint256;

    mapping(address => uint256) private _stakes;

    uint256 private constant STAKE_AMOUNT = 0.01 ether;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function stake() external payable {
        require(msg.value == STAKE_AMOUNT, "Must stake exactly 0.01 ETH");
        _stakes[msg.sender] = _stakes[msg.sender].add(msg.value);
        emit Staked(msg.sender, msg.value);
    }

    function withdraw() external nonReentrant {
        uint256 stakedAmount = _stakes[msg.sender];
        require(stakedAmount > 0, "No stake to withdraw");
        
        _stakes[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: stakedAmount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawn(msg.sender, stakedAmount);
    }

    function getStakedAmount(address user) external view returns (uint256) {
        return _stakes[user];
    }
}
