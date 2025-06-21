// File: trustnet/blockchain/createCircuit.js

import fs from "fs";
import path from "path";

// The exact, correct code for the circuit
const circuitCode = `pragma circom 2.0.0;

template Sum() {
    signal input a;
    signal input b;
    signal output c;
    c <== a + b;
}

component main = Sum();`;

const circuitsDir = path.join(process.cwd(), "circuits");
const filePath = path.join(circuitsDir, "sum.circom");

// Ensure the circuits directory exists
if (!fs.existsSync(circuitsDir)) {
  fs.mkdirSync(circuitsDir, { recursive: true });
}

// Write the file with proper formatting
fs.writeFileSync(filePath, circuitCode);

console.log(
  `✅ Successfully created 'circuits/sum.circom' with the correct content.`
);
