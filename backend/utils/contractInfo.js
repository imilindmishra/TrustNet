// File: trustnet/backend/utils/contractInfo.js

export const verifierContractAddress =
  "0xB3B0568CC49d2F688450D4BE02854d5B5f5212F1";

export const verifierContractAbi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "endorser", "type": "address" }, { "indexed": true, "internalType": "address", "name": "endorsed", "type": "address" } ], "name": "EndorsementVerified", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "endorser", "type": "address" }, { "internalType": "address", "name": "endorsed", "type": "address" }, { "internalType": "bytes", "name": "dummyProof", "type": "bytes" } ], "name": "verifyEndorsement", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" } ]; // Copy-paste the ABI array here
