const Workflow = require("../models/workflow.model");
const Execution = require("../models/execution.model");
const { sendEmail } = require("../services/email.service");
const { workflowQueue } = require("../queues/workflowQueue");
const userModel = require("../models/user.model");


exports.executeWorkflow = async (req, res) => {
    const workflow = await Workflow.findById(req.params.id);
    const user = await userModel.findById(req.user.id);
    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }
    const job = await workflowQueue.add("send-email", {
        workflowId: workflow._id,
        userId: user.id
    });
    console.log(user.id);
    console.log(user.email);
    console.log("JOB ADDED:", job.id);

    res.json({ message: "Workflow queued successfully" });
    const waiting = await workflowQueue.getWaiting();
    const active = await workflowQueue.getActive();
    const completed = await workflowQueue.getCompleted();
    const failed = await workflowQueue.getFailed();

    console.log("ACTIVE FULL DATA:", active.map(j => j.data));


};




exports.createWorkflow = async (req, res) => {
    const workflow = await Workflow.create({
        userId: req.user,
        name: req.body.name,
        trigger: req.body.trigger,
        actions: req.body.actions
    });

    res.status(201).json(workflow);
};
