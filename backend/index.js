// File: index.js (Corrected Version)

import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import connectDB from "./db.js";
import TrustScore from "./models/TrustScore.js";
import {
  verifierContractAddress,
  verifierContractAbi,
} from "./utils/contractInfo.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("TrustNet Backend is Running!"));

app.get("/trust-score/:address", async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`Searching for score for address: ${address}`);

    // --- THIS IS THE CORRECTED CODE ---
    const result = await TrustScore.findOne({
      address: { $regex: new RegExp(`^${address}$`, "i") }
    });
    // --- END OF FIX ---

    if (result) {
      res.json({ address: result.address, score: result.score });
    } else {
      res.status(404).json({ error: "Score not found for this address." });
    }
  } catch (error) {
    console.error("API Error in /trust-score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Your /verify-endorsement route is here...
app.post("/verify-endorsement", async (req, res) => {
    try {
      const { endorser, endorsed, dummyProof } = req.body;

      if (!endorser || !endorsed || !dummyProof) {
        return res
          .status(400)
          .json({
            error: "Missing required fields: endorser, endorsed, dummyProof",
          });
      }

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.OPTIMISM_SEPOLIA_RPC_URL
      );
      const verifierContract = new ethers.Contract(
        verifierContractAddress,
        verifierContractAbi,
        provider
      );
      const isVerified = await verifierContract.verifyEndorsement(
        endorser,
        endorsed,
        dummyProof
      );

      res.json({
        message: "Verification simulated successfully",
        isVerified: isVerified,
      });
    } catch (error) {
      console.error("API Error in /verify-endorsement:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


connectDB().then(() => {
  app.listen(3000, () => console.log("Backend running on port 3000"));
});