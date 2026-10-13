import type { Metadata } from "next";
import { ProjectDetailClient } from "./project-detail-client";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Project · ${params.id}` };
}

export default function ProjectDetailPage({ params }: Props) {
  return <ProjectDetailClient id={params.id} />;
}
