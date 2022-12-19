import { Job } from "bullmq";
import Redis from "ioredis";

const redis = new Redis();
const channel = "chat";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Dummy worker
 *
 * This worker is responsible for doing something useful.
 *
 */
export default async function (job: Job) {
  await job.log("Start processing job");

  console.log("START: generate image", job.id, job.data);
  // redis.publish(channel, JSON.stringify(job));
  const delayInMicroseconds = Number(Math.random() * 1000 + 2000);
  console.log({ id: job.id, delayInMicroseconds });

  await delay(delayInMicroseconds);

  redis.publish(channel, `${job.id} completed!`);

  console.log("FINISHED: generate image", job.id, job.data);
}
