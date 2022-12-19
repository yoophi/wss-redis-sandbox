import { Job, Queue } from "bullmq";
import Redis from "ioredis";

const redis = new Redis();
const channel = "chat";

const connection = {
  host: "localhost",
  port: 6379,
};

// const generateImageQueue = new Queue("generate-image", {
//   connection,
// });

/**
 * Dummy worker
 *
 * This worker is responsible for doing something useful.
 *
 */
export default async function (job: Job) {
  await job.log("Start processing job");

  console.log("hello function!");

  const size = job.data.size || 10;
  console.log("generate-image-set worker", { size });

  console.log("---");

  for (let i = 0; i <= Number(size); i++) {
    console.log("QUEUE:");
    // await generateImageQueue.add("QUEUE: generate-image", { id: i });
  }
  console.log("===");

  redis.publish(channel, JSON.stringify(job));

  console.log("generate image set", job.id, job.data);
}
