const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { url, key } = req.body;

  if (!url || !key) {
    return res.status(400).json({ error: "Supabase URL and Service Role Key are required" });
  }

  try {
    const response = await axios.post(
      `${url}/rest/v1/rpc/list_public_tables`,
      {},
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching tables:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch tables" });
  }
});

module.exports = router;
