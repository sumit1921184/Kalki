const mongoose = require("mongoose");

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongoose connection success");
    }
    catch (err) {
        console.log("Mongoose connection error", err);
        process.exit(1);
    }
}

module.exports = connectionDB;