import type { Metadata } from "next";
import { MembershipsClient } from "./memberships-client";

export const metadata: Metadata = {
  title: "Memberships & Access",
  description: "Manage cross-category membership durations, validity windows, and extensions.",
};

export default function MembershipsPage() {
  return <MembershipsClient />;
}
