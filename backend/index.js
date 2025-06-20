// File: index.js

import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

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

// --- Swagger API Documentation Setup ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TrustNet API",
      version: "1.0.0",
      description:
        "API for the TrustNet system to fetch trust scores and verify endorsements.",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./index.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// --- End Swagger Setup ---

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check server status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Confirmation message that the server is active
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: TrustNet Backend is Running! API docs are available at /api-docs
 */
app.get("/", (req, res) =>
  res.send("TrustNet Backend is Running! API docs are available at /api-docs")
);

/**
 * @swagger
 * /trust-score/{address}:
 *   get:
 *     summary: Retrieve the trust score for a given contributor address
 *     tags: [TrustScore]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         description: The Ethereum address or identifier of the contributor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The contributor's trust score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 score:
 *                   type: number
 *       404:
 *         description: Score not found for the provided address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get("/trust-score/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const result = await TrustScore.findOne({
      address: { $regex: `^${address}$`, $options: "i" },
    });
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

/**
 * @swagger
 * /verify-endorsement:
 *   post:
 *     summary: Simulate the verification of a private endorsement
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endorser
 *               - endorsed
 *               - dummyProof
 *             properties:
 *               endorser:
 *                 type: string
 *                 example: '0x1234567890123456789012345678901234567890'
 *               endorsed:
 *                 type: string
 *                 example: '0x0987654321098765432109876543210987654321'
 *               dummyProof:
 *                 type: string
 *                 example: '0xabc123'
 *     responses:
 *       200:
 *         description: Confirmation that the simulated verification was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isVerified:
 *                   type: boolean
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.post("/verify-endorsement", async (req, res) => {
  try {
    const { endorser, endorsed, dummyProof } = req.body;
    if (!endorser || !endorsed || !dummyProof) {
      return res.status(400).json({ error: "Missing required fields" });
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
    res.json({ message: "Verification simulated successfully", isVerified });
  } catch (error) {
    console.error("API Error in /verify-endorsement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

connectDB().then(() => {
  app.listen(3000, () =>
    console.log(
      "Backend running on port 3000. API docs at http://localhost:3000/api-docs"
    )
  );
});
