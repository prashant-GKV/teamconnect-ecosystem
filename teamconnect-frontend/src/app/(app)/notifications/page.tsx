import type { Metadata } from "next";
export const metadata: Metadata = { title: "Notifications" };
import { NotificationsClient } from "./notifications-client";
export default function NotificationsPage() { return <NotificationsClient />; }