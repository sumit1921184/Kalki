require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectionDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const workflowRoutes = require("./routes/workflow.routes");


const app = express();
connectionDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});