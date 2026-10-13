import type { Metadata } from "next";
import { CategoryDetailClient } from "./category-client";

export const metadata: Metadata = {
  title: "Category Workspace",
  description: "Manage category members, category-scoped tasks, review queue, delegations, and announcements.",
};

export default function CategoryPage({ params }: { params: { id: string } }) {
  return <CategoryDetailClient categoryId={params.id} />;
}
