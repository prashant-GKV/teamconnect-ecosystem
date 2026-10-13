import type { Metadata } from "next";
import { LandingPageContent } from "@/components/landing/landing-page-content";

export const metadata: Metadata = {
  title: "TeamConnect Ecosystem — Operational Governance & Cross-Functional Project Platform",
  description:
    "An enterprise operations platform unifying functional department workflows, cross-project resource governance, and auditable task delivery in one transparent workspace.",
  openGraph: {
    title: "TeamConnect Ecosystem — Operational Governance & Cross-Functional Project Platform",
    description:
      "Coordinate department operations, borrow talent across teams, and deliver auditable outcomes with structured review workflows.",
    type: "website",
  },
};

export default function RootPage() {
  return <LandingPageContent />;
}