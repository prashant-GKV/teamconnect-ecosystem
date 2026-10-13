import type { Metadata } from "next";
import { ProjectTasksClient } from "./project-tasks-client";

export const metadata: Metadata = {
  title: "Project Tasks",
  description: "Cross-category project tasks requiring active membership.",
};

export default function ProjectTasksPage() {
  return <ProjectTasksClient />;
}
