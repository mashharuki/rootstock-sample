// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "wormhole-solidity-sdk/WormholeRelayerSDK.sol";
import "wormhole-solidity-sdk/interfaces/token/IERC20.sol";

contract CrossChainReceiver is TokenReceiver {
    // The wormhole relayer and registeredSenders are inherited from the Base.sol contract.

    constructor(address _wormholeRelayer, address _tokenBridge, address _wormhole)
        TokenBase(_wormholeRelayer, _tokenBridge, _wormhole)
    {}

    // Function to receive the cross-chain payload and tokens with emitter validation
    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 // deliveryHash (not used in this implementation)
    ) internal override onlyWormholeRelayer isRegisteredSender(sourceChain, sourceAddress) {
        require(receivedTokens.length == 1, "Expected 1 token transfer");

        // Decode the recipient address from the payload
        address recipient = abi.decode(payload, (address));

        // Transfer the received tokens to the intended recipient
        IERC20(receivedTokens[0].tokenAddress).transfer(recipient, receivedTokens[0].amount);
    }
}