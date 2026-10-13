import type { Metadata } from "next";
import { RequestsClient } from "../requests-client";
export const metadata: Metadata = { title: "Requests Outbox" };
export default function OutboxPage() { return <RequestsClient type="outbox" />; }