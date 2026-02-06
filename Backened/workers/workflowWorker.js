require("dotenv").config();
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const { connection } = require("../queues/workflowQueue");

const Workflow = require("../models/workflow.model");
const Execution = require("../models/execution.model");
const { sendEmail } = require("../services/email.service");


// 🔥 CONNECT MONGO INSIDE WORKER
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Worker Mongo connected"))
    .catch(err => console.error("Mongo error:", err));


// 👷 WORKER
new Worker(
    "workflowQueue",
    async job => {
        if (job.name !== "send-email") return;

        console.log("🔥 JOB RECEIVED:", job.data);

        const { workflowId, userId } = job.data;

        const workflow = await Workflow.findById(workflowId);
        if (!workflow) throw new Error("Workflow not found");

        const execution = await Execution.create({
            workflowId,
            userId,
            status: "running",
            logs: []
        });

        const actions = workflow.actions.sort((a, b) => a.order - b.order);

        for (let action of actions) {

            if (action.type === "send_email") {
                await sendEmail({
                    to: action.config.to,
                    subject: "Automation Email",
                    text: "Hello! Sent via BullMQ 🚀"
                });

                console.log("📩 Email sent to:", action.config.to);
            }

            execution.logs.push({
                step: action.order,
                actionType: action.type,
                status: "success",
                message: "Executed"
            });

            await execution.save();
        }

        execution.status = "success";
        await execution.save();

        console.log("✅ Workflow completed");
    },
    { connection }
);

console.log("👷 Worker running...");
