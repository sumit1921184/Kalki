const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    createWorkflow,
    executeWorkflow
} = require("../controllers/workflow.controller");

router.post("/", auth, createWorkflow);
router.post("/:id/execute", auth, executeWorkflow);

module.exports = router;
