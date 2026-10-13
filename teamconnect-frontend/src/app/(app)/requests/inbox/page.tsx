import type { Metadata } from "next";
import { RequestsClient } from "../requests-client";
export const metadata: Metadata = { title: "Requests Inbox" };
export default function InboxPage() { return <RequestsClient type="inbox" />; }