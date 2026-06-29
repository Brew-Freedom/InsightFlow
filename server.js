const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic upload endpoint
app.post("/api/upload", (req, res) => {
  res.json({ 
    message: "Upload endpoint is working!",
    status: "success"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is running",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/upload - Upload CSV files`);
  console.log(`GET http://localhost:${PORT}/api/health - Health check`);
});

module.exports = app;
