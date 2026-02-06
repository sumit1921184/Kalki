const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
});



const workflowQueue = new Queue("workflowQueue", {
    connection
});

module.exports = { workflowQueue, connection };

