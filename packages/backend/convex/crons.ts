import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("expire demo accounts", { hours: 6 }, internal.demoCleanup.expireUsers, {});
export default crons;
