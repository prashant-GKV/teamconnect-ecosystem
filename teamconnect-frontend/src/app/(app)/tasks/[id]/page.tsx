import type { Metadata } from "next";
import { TaskDetailClient } from "./task-detail-client";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Task · ${params.id}` };
}

export default function TaskDetailPage({ params }: Props) {
  return <TaskDetailClient id={params.id} />;
}
