import type { Metadata } from "next";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse active projects, staffing levels, and cross-functional teams.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
