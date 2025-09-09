import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

app.use(cors({
  origin: ["http://127.0.0.1:5502/", "https://fuel-location.vercel.app/"]
}));


dotenv.config();

const app = express();

app.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=gas_station&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error_message) {
      console.error("Google API Error:", data.error_message);
      return res.status(500).json({ error: data.error_message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Failed to fetch from Google API" });
  }
});

app.get("/geocode", async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
