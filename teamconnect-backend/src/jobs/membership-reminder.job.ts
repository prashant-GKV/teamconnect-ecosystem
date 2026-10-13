// Runs daily: sends notifications for memberships expiring within WORKER_REMINDER_DAYS
import { CronJob } from "cron";
import { env } from "../config/env";
import { logger } from "../shared/logger";

export function startMembershipReminderJob(): CronJob {
  return new CronJob(env.WORKER_OVERDUE_CRON, async () => {
    logger.info("membership-reminder job: starting run");
    // TODO Phase 2: implement reminder logic
  }, null, true, "UTC");
}
