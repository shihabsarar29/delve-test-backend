const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");
const tablesRoutes = require("./routes/tables");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tables", tablesRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
