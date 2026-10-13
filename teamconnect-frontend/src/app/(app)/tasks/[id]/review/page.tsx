import type { Metadata } from "next";
import { TaskDetailClient } from "../task-detail-client";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Review Task · ${params.id}` };
}

export default function ReviewTaskPage({ params }: Props) {
  return <TaskDetailClient id={params.id} initialAction="review" />;
}
