// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Library {
    // Define enum 'State' with the following values:
    enum State {
        CREATED,
        FOR_SALE,
        NOT_AVAILABLE,
        ON_DELIVERY,
        RECEIVED
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}