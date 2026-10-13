import type { Metadata } from "next";
import { ReviewsClient } from "./reviews-client";

export const metadata: Metadata = {
  title: "Reviews Center",
  description: "Inspect task deliverables, submit approvals, or request revisions.",
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
