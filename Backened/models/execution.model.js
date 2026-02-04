const mongoose = require("mongoose");

const executionSchema = new mongoose.Schema({
    workflowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workflow",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["running", "success", "failed"],
        default: "running"
    },

    logs: [
        {
            step: Number,
            actionType: String,
            status: String,
            message: String
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Execution", executionSchema);
