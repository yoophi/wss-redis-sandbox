import { Job } from "bullmq";
import Redis from "ioredis";

const redis = new Redis();
const channel = "chat";

/**
 * Dummy worker
 *
 * This worker is responsible for doing something useful.
 *
 */
export default async function (job: Job) {
  await job.log("Start processing job");
  redis.publish(channel, JSON.stringify(job));

  console.log("Doing something useful...", job.id, job.data);
}
