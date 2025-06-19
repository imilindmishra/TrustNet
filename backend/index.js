const express = require("express");
const connectDB = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("TrustNet Backend"));

connectDB().then(() => {
  app.listen(3000, () => console.log("Backend running on port 3000"));
});
