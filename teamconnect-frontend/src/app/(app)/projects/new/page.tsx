import type { Metadata } from "next";
import { NewProjectClient } from "./new-project-client";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Initialize cross-category project workspaces and staffing constraints.",
};

export default function NewProjectPage() {
  return <NewProjectClient />;
}
