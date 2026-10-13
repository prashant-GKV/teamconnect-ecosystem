// Runs daily at 6am UTC: marks tasks past dueAt as overdue and sends notifications
import { CronJob } from "cron";
import { env } from "../config/env";
import { logger } from "../shared/logger";

export function startOverdueTasksJob(): CronJob {
  return new CronJob(env.WORKER_OVERDUE_CRON, async () => {
    logger.info("overdue-tasks job: starting run");
    // TODO Phase 2: implement overdue task logic
  }, null, true, "UTC");
}
