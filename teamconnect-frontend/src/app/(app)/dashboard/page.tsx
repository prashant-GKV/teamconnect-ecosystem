import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Organizational task queue, collaboration requests, and key performance indicators.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
