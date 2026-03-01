const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Secure Artifact Repository API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/artifacts", require("./routes/artifactRoutes"));

const orgRoutes = require("./routes/orgRoutes");
app.use("/api/org", orgRoutes);

const shareRoutes = require("./routes/shareRoutes");
app.use("/api/share", shareRoutes);