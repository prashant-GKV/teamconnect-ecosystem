// /dev/components — design system showcase (dev-only)
// Shows every component in every meaningful state
import type { Metadata } from "next";
import { DevShowcase } from "./showcase";

export const metadata: Metadata = { title: "Component Showcase — Dev" };

export default function DevComponentsPage() {
  return <DevShowcase />;
}