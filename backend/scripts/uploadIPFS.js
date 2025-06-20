// File: backend/scripts/uploadIPFS.js - Naya code Pinata ke liye

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import "dotenv/config";

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_URL = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

const uploadFileToPinata = async (filePath, fileName) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const metadata = JSON.stringify({ name: fileName });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({ cidVersion: 0 });
  formData.append("pinataOptions", options);

  try {
    console.log(`Uploading ${fileName} to Pinata...`);
    const res = await axios.post(PINATA_URL, formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });
    // The response contains the IpfsHash, which is our CID
    return res.data.IpfsHash;
  } catch (error) {
    console.error(
      `Error uploading ${fileName}:`,
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const runUploads = async () => {
  const filesToUpload = ["contributor1.json", "contributor2.json"];
  const cids = [];

  for (const fileName of filesToUpload) {
    const filePath = `./data/${fileName}`;
    const cid = await uploadFileToPinata(filePath, fileName);
    if (cid) {
      console.log(`Successfully uploaded ${fileName}. CID: ${cid}`);
      cids.push(cid);
    }
  }

  if (cids.length > 0) {
    console.log("\nAll CIDs from Pinata:", cids);
  } else {
    console.log(
      "\nCould not upload files to Pinata. Please check errors above."
    );
  }
};

runUploads();
