const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectionDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
dotenv.config();

const app = express();
connectionDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});