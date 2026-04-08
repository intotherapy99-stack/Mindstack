import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindStack — Infrastructure for India's Mental Health Professionals",
  description:
    "Practice management, clinical supervision marketplace, and professional tools for psychiatrists, psychologists, counselors, and therapists in India.",
  keywords: [
    "mental health",
    "India",
    "psychiatrist",
    "psychologist",
    "counselor",
    "practice management",
    "clinical supervision",
    "mental health practice",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
