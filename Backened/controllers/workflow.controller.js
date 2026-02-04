const Workflow = require("../models/workflow.model");
const Execution = require("../models/execution.model");
const { sendEmail } = require("../services/email.service");
require("dotenv").config();

exports.executeWorkflow = async (req, res) => {
    const workflowId = req.params.id;

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    // Create execution record
    const execution = await Execution.create({
        workflowId: workflow._id,
        userId: req.user,
        status: "running",
        logs: []
    });

    // Sort actions by order
    const actions = workflow.actions.sort((a, b) => a.order - b.order);

    for (let action of actions) {
        try {
            if (action.type === "send_email") {
                await sendEmail({
                    to: action.config.to,
                    subject: "Automation Email",
                    text: "Hello! Sent via Mini Zapier"
                });
            }

            execution.logs.push({
                step: action.order,
                actionType: action.type,
                status: "success",
                message: "Action executed successfully"
            });

            await execution.save();

            return res.json({
                message: "Workflow executed successfully",
                execution
            });

        } catch (err) {
            execution.logs.push({
                step: action.order,
                actionType: action.type,
                status: "failed",
                message: err.message
            });

            execution.status = "failed";
            await execution.save();

            return res.status(500).json({
                message: "Workflow failed at step " + action.order,
                execution
            });
        }
    }
}



exports.createWorkflow = async (req, res) => {
    const workflow = await Workflow.create({
        userId: req.user,
        name: req.body.name,
        trigger: req.body.trigger,
        actions: req.body.actions
    });

    res.status(201).json(workflow);
};
