
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingHoleskySC is ReentrancyGuard {
    using SafeMath for uint256;

    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;
    uint256 public totalStaked;

    uint256 private constant APR = 500; // 5% APR
    uint256 private constant APR_DENOMINATOR = 10000;
    uint256 private constant SECONDS_IN_YEAR = 31536000;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    function stake() external payable nonReentrant {
        require(msg.value > 0, "Cannot stake 0 ETH");

        if (stakes[msg.sender].amount > 0) {
            uint256 reward = calculateRewards(msg.sender);
            stakes[msg.sender].amount = stakes[msg.sender].amount.add(reward);
        }

        stakes[msg.sender].amount = stakes[msg.sender].amount.add(msg.value);
        stakes[msg.sender].timestamp = block.timestamp;
        totalStaked = totalStaked.add(msg.value);

        emit Staked(msg.sender, msg.value);
    }

    function withdraw() external nonReentrant {
        require(stakes[msg.sender].amount > 0, "No stake to withdraw");

        uint256 reward = calculateRewards(msg.sender);
        uint256 totalAmount = stakes[msg.sender].amount.add(reward);

        stakes[msg.sender].amount = 0;
        stakes[msg.sender].timestamp = 0;
        totalStaked = totalStaked.sub(stakes[msg.sender].amount);

        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, stakes[msg.sender].amount, reward);
    }

    function getStakeInfo(address user) external view returns (uint256 stakedAmount, uint256 reward) {
        stakedAmount = stakes[user].amount;
        reward = calculateRewards(user);
    }

    function calculateRewards(address user) internal view returns (uint256) {
        if (stakes[user].amount == 0) {
            return 0;
        }

        uint256 stakingDuration = block.timestamp.sub(stakes[user].timestamp);
        uint256 reward = stakes[user].amount.mul(APR).mul(stakingDuration).div(SECONDS_IN_YEAR).div(APR_DENOMINATOR);

        return reward;
    }
}
