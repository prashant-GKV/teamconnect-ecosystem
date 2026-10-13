import { RequestDetailClient } from "./request-detail-client";

interface PageProps {
  params: { id: string };
}

export default function RequestDetailPage({ params }: PageProps) {
  return <RequestDetailClient id={params.id} />;
}
