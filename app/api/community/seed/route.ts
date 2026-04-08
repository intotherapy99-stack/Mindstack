import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// One-time seed endpoint for default community spaces
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 });
  }

  const existing = await prisma.space.count();
  if (existing > 0) {
    return NextResponse.json({ message: "Spaces already seeded", count: existing });
  }

  const defaultSpaces = [
    { name: "Clinical Case Discussions", description: "Discuss anonymized clinical cases, seek peer consultation on therapeutic approaches, and share evidence-based practices.", category: "CLINICAL" as const, type: "MODERATED" as const, iconEmoji: "🧠" },
    { name: "Private Practice Business", description: "Share tips on running a private practice in India — marketing, pricing, insurance panels, space setup, and more.", category: "BUSINESS" as const, type: "OPEN" as const, iconEmoji: "💼" },
    { name: "Ethics & Legal", description: "Discuss ethical dilemmas, DPDP Act compliance, boundary issues, informed consent, and regulatory updates.", category: "ETHICS" as const, type: "MODERATED" as const, iconEmoji: "⚖️" },
    { name: "Training & Workshops", description: "Share and discover upcoming workshops, training programs, certifications, and continuing education opportunities.", category: "TRAINING" as const, type: "OPEN" as const, iconEmoji: "📚" },
    { name: "Research & Evidence", description: "Discuss recent papers, Indian mental health research, and evidence-based treatment updates.", category: "CLINICAL" as const, type: "OPEN" as const, iconEmoji: "🔬" },
    { name: "General Discussion", description: "Open forum for anything related to mental health practice in India that doesn't fit elsewhere.", category: "GENERAL" as const, type: "OPEN" as const, iconEmoji: "💬" },
  ];

  await prisma.space.createMany({ data: defaultSpaces });

  return NextResponse.json({ message: "Seeded default spaces", count: defaultSpaces.length });
}
