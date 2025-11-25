import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const data = JSON.parse(fs.readFileSync("./data.json"));

app.get("/", (req, res) => {
  res.send("Node server is running!");
});

app.get("/api/data", (req, res) => {
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
