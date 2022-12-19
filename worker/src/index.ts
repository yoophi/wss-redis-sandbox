import { Worker, QueueScheduler } from "bullmq";
import { queueName } from "./types";

const connection = {
  host: "localhost",
  port: 6379,
};

const myQueue = new Worker(queueName, `${__dirname}/workers/my-worker.js`, {
  connection,
});
const generateImageSetQueueWorker = new Worker(
  "generate-image-set",
  `${__dirname}/workers/generate-image-set.js`,
  {
    connection,
  }
);
const generateImageQueueWorker = new Worker(
  "generate-image",
  `${__dirname}/workers/generate-image.js`,
  {
    concurrency: 10,
    connection,
  }
);

const myQueueScheduler = new QueueScheduler(queueName, {
  connection,
});

process.on("SIGTERM", async () => {
  console.info("SIGTERM signal received: closing queues");

  await myQueue.close();
  await myQueueScheduler.close();
  await generateImageQueueWorker.close();
  await generateImageSetQueueWorker.close();

  console.info("All closed");
});
