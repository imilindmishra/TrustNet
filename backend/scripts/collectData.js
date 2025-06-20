// File: backend/scripts/collectData.js

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../db.js";
import Interaction from "../models/Interaction.js";

// --- Humara Data ---
const ipfsCids = {
  contributor1: "QmfPXpzragcE2TzuMxsxNngXZUwdbSqJBMzNPsewcd3P4S",
  contributor2: "QmTJQqJXEibkSPCKzfkP9f8HCxtm88FygFmzRJHmdQiVsM",
};

const ceramicStreamId =
  "kjzl6cwe1jw145cjbeko9ha98yhsj23c2g6gdah0d5p09evwGkddeC13hDTy0ar"; // Mock ID

// --- Script ---

const run = async () => {
  await connectDB();
  console.log("Database connected. Preparing to insert data...");

  await Interaction.deleteMany({});
  console.log("Cleared old interactions from the database.");

  const allInteractions = [];

  // 1. REAL IPFS Data
  allInteractions.push({
    from: "0x123",
    to: "DAO1",
    type: "collaboration",
    source: "IPFS",
    reference: ipfsCids.contributor1,
  });
  allInteractions.push({
    from: "0x456",
    to: "DAO1",
    type: "collaboration",
    source: "IPFS",
    reference: ipfsCids.contributor2,
  });

  // 2. MOCK Ceramic Profile Data
  allInteractions.push({
    from: "0x123",
    to: "0x123",
    type: "profile",
    source: "Ceramic",
    reference: ceramicStreamId,
  });

  // 3. MOCK Lens Endorsement Data
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const lensDataPath = path.join(__dirname, "..", "data", "mockLens.json");
  const mockLensData = JSON.parse(fs.readFileSync(lensDataPath, "utf-8"));

  for (const endorsement of mockLensData) {
    allInteractions.push({
      from: endorsement.from,
      to: endorsement.to,
      type: "endorsement",
      source: "Lens",
      reference: `lens-mock-endorsement`,
      details: { content: endorsement.content },
    });
  }

  await Interaction.insertMany(allInteractions);
  console.log(
    `Successfully inserted ${allInteractions.length} interaction documents into MongoDB!`
  );

  await mongoose.disconnect();
  console.log("Database connection closed.");
};

run().catch(async (err) => {
  console.error("Data collection script failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
