import { NextResponse } from "next/server";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#B44C08"/>
    <path d="M16 8L18.47 13.01L24 13.82L20 17.72L20.94 23.23L16 20.63L11.06 23.23L12 17.72L8 13.82L13.53 13.01L16 8Z" fill="#FAF7F2"/>
  </svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
