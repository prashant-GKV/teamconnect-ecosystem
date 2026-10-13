import type { Metadata } from "next";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account preferences, delegation authorities, and notification controls.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
