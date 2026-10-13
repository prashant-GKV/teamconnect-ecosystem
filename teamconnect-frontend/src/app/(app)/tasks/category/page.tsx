import type { Metadata } from "next";
import { CategoryTasksClient } from "./category-tasks-client";

export const metadata: Metadata = {
  title: "Category Tasks",
  description: "Tasks scoped to your category with lead review workflows.",
};

export default function CategoryTasksPage() {
  return <CategoryTasksClient />;
}
