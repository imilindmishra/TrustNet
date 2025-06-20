// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TrustScore {
    address public owner;

    struct Attestation {
        address attestedBy;
        uint256 score;
        string reason;
        uint256 timestamp;
    }

    mapping(address => Attestation[]) public attestations;

    event ScoreUpdated(address indexed contributor, uint256 newScore, string reason);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function updateScore(address contributor, uint256 score, string calldata reason) public onlyOwner {
        attestations[contributor].push(Attestation({
            attestedBy: msg.sender,
            score: score,
            reason: reason,
            timestamp: block.timestamp
        }));
        emit ScoreUpdated(contributor, score, reason);
    }

    function getAttestations(address contributor) public view returns (Attestation[] memory) {
        return attestations[contributor];
    }
}
