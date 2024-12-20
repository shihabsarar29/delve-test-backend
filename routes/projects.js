const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { url, key, token } = req.body;

  if (!url || !key || !token) {
    return res.status(400).json({ error: "Access Token is required" });
  }

  try {
    const projectsResponse = await axios.get(`https://api.supabase.com/v1/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const projects = projectsResponse.data;

    const projectsWithPitrStatus = await Promise.all(
      projects.map(async (project) => {
        try {
          const backupResponse = await axios.get(
            `https://api.supabase.com/v1/projects/${project.id}/database/backups`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          return {
            ...project,
            pitr_enabled: backupResponse.data.pitr_enabled,
          };
        } catch (backupError) {
          console.error(`Error fetching backups for project ${project.ref}:`, backupError.response?.data || backupError.message);
          return {
            ...project,
            pitr_enabled: null,
          };
        }
      })
    );

    res.json(projectsWithPitrStatus);
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

module.exports = router;
