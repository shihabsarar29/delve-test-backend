const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

router.post("/", async (req, res) => {
  const { url, key } = req.body;

  if (!url || !key) {
    return res.status(400).json({ error: "Supabase URL and Service Role Key are required" });
  }

  try {
    const supabaseClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabaseClient.auth.admin.listUsers();
    if (error) throw error;

    const results = data.users.map(user => ({
      ...user,
      mfa_enabled: user.app_metadata.providers > 1,
    }));

    res.json(results);
  } catch (e) {
    console.error("Error fetching users:", e.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
