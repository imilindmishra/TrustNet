// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EndorsementVerifier {
    event EndorsementVerified(address indexed endorser, address indexed endorsed);

    function verifyEndorsement(
        address endorser,
        address endorsed,
        bytes calldata dummyProof
    ) public pure returns (bool) {
        require(endorser != address(0), "Endorser cannot be the zero address");
        require(endorsed != address(0), "Endorsed cannot be the zero address");
        require(dummyProof.length > 0, "Proof cannot be empty");
        return true;
    }
}
