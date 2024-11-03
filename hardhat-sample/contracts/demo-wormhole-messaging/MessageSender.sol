// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";

/**
 * 送信側のコントラクト
 */
contract MessageSender {
    IWormholeRelayer public wormholeRelayer;
    uint256 constant GAS_LIMIT = 50000; // Adjust the gas limit as needed

    /**
     * コンストラクター
     */
    constructor(address _wormholeRelayer) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    function quoteCrossChainCost(uint16 targetChain) public view returns (uint256 cost) {
        (cost,) = wormholeRelayer.quoteEVMDeliveryPrice(targetChain, 0, GAS_LIMIT);
    }

    /**
     * 受信側にメッセージを送信するメソッド
     */
    function sendMessage(uint16 targetChain, address targetAddress, string memory message) external payable {
        uint256 cost = quoteCrossChainCost(targetChain); // Dynamically calculate the cross-chain cost
        require(msg.value >= cost, "Insufficient funds for cross-chain delivery");

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(message, msg.sender), // Payload contains the message and sender address
            0, // No receiver value needed
            GAS_LIMIT // Gas limit for the transaction
        );
    }
}