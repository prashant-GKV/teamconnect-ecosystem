// Runs hourly: expires memberships past their endAt date
// Sets status: active/expiring_soon -> expired
// Does NOT revoke access — that requires explicit admin action
import { CronJob } from "cron";
import { env } from "../config/env";
import { logger } from "../shared/logger";

export function startMembershipExpiryJob(): CronJob {
  return new CronJob(env.WORKER_EXPIRY_CRON, async () => {
    logger.info("membership-expiry job: starting run");
    // TODO Phase 2: implement membership expiry logic
  }, null, true, "UTC");
}
