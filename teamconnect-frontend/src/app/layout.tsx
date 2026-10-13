import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | TeamConnect",
    default: "TeamConnect — Organizational Collaboration Dashboard",
  },
  description: "Manage cross-category projects, scoped tasks, and transparent team collaboration with TeamConnect.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C2410C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="font-body antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
