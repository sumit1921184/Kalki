const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    config: {
        type: Object,
        default: {}
    },
    order: {
        type: Number,
        required: true
    }
});

const workflowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    trigger: {
        type: {
            type: String,
            enum: ["manual", "webhook"],
            required: true
        },
        config: {
            type: Object,
            default: {}
        }
    },

    actions: [actionSchema]

}, { timestamps: true });

module.exports = mongoose.model("Workflow", workflowSchema);
