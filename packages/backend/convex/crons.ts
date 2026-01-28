import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("purge-expired-data", { hours: 24 }, internal.retention.purgeExpiredData);

export default crons;
