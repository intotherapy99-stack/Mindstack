import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mindstack.in" },
    update: {},
    create: {
      email: "admin@mindstack.in",
      phone: "+919999999999",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
      phoneVerified: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      displayName: "MindStack Admin",
      slug: "admin",
      city: "Mumbai",
      state: "Maharashtra",
      role: "CLINICAL_PSYCHOLOGIST",
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
      isPublic: false,
    },
  });

  // Create sample supervisor
  const supervisorPassword = await bcrypt.hash("Supervisor123!", 12);
  const supervisor = await prisma.user.upsert({
    where: { email: "dr.anand@example.com" },
    update: {},
    create: {
      email: "dr.anand@example.com",
      phone: "+919876543210",
      passwordHash: supervisorPassword,
      emailVerified: new Date(),
      phoneVerified: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: supervisor.id },
    update: {},
    create: {
      userId: supervisor.id,
      displayName: "Dr. Anand Mehta",
      slug: "dr-anand-mehta",
      avatarUrl: null,
      bio: "Clinical psychologist with 14 years of experience in cognitive-behavioral and psychodynamic approaches. I specialize in treating anxiety disorders, depression, and complex trauma. My supervision style emphasizes developing clinical reasoning through reflective practice.",
      city: "Mumbai",
      state: "Maharashtra",
      yearsExperience: 14,
      role: "CLINICAL_PSYCHOLOGIST",
      specializations: ["Anxiety", "Depression", "Trauma & PTSD", "OCD", "Relationship Issues"],
      modalities: ["CBT", "Psychodynamic", "EMDR", "ACT"],
      languages: ["English", "Hindi", "Marathi"],
      rciNumber: "A12345",
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
      offersSupervision: true,
      supervisionFee: 1800,
      supervisionModality: "HYBRID",
      supervisionApproach: "I use a Socratic method focused on developing clinical reasoning. Sessions include case discussions, role-play, and reflective journaling.",
      supervisionBio: "I have been supervising junior psychologists for over 8 years. My approach combines structured case analysis with reflective practice to help supervisees develop their clinical identity.",
      maxSuperviseesCount: 5,
      sessionDuration: 50,
      sessionFee: 2500,
      bookingPageEnabled: true,
      bufferTime: 10,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: supervisor.id },
    update: {},
    create: {
      userId: supervisor.id,
      plan: "SOLO",
      status: "ACTIVE",
      startDate: new Date(),
    },
  });

  // Set up supervisor availability (Mon-Fri, 9am-5pm)
  for (let day = 1; day <= 5; day++) {
    await prisma.availability.create({
      data: {
        userId: supervisor.id,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
      },
    });
  }

  // Create sample junior counselor
  const juniorPassword = await bcrypt.hash("Junior123!", 12);
  const junior = await prisma.user.upsert({
    where: { email: "priya.sharma@example.com" },
    update: {},
    create: {
      email: "priya.sharma@example.com",
      phone: "+919876543211",
      passwordHash: juniorPassword,
      emailVerified: new Date(),
      phoneVerified: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: junior.id },
    update: {},
    create: {
      userId: junior.id,
      displayName: "Priya Sharma",
      slug: "priya-sharma",
      bio: "Counseling psychologist focused on young adults dealing with anxiety, career stress, and identity exploration. I believe therapy should be a safe, warm space.",
      city: "Bangalore",
      state: "Karnataka",
      yearsExperience: 2,
      role: "COUNSELOR",
      specializations: ["Anxiety", "Career & Burnout", "Depression", "Relationship Issues"],
      modalities: ["CBT", "Humanistic", "Narrative"],
      languages: ["English", "Hindi", "Kannada"],
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
      offersSupervision: false,
      sessionDuration: 50,
      sessionFee: 1200,
      bookingPageEnabled: true,
      bufferTime: 10,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: junior.id },
    update: {},
    create: {
      userId: junior.id,
      plan: "FREE",
      status: "ACTIVE",
      startDate: new Date(),
    },
  });

  // Create sample clients for Priya
  const clientNames = [
    { firstName: "Rahul", lastName: "Kapoor", concern: "Anxiety", status: "ACTIVE" as const },
    { firstName: "Sneha", lastName: "Reddy", concern: "Career & Burnout", status: "ACTIVE" as const },
    { firstName: "Arjun", lastName: "Patel", concern: "Depression", status: "ACTIVE" as const },
    { firstName: "Meera", lastName: "Nair", concern: "Relationship Issues", status: "ON_HOLD" as const },
  ];

  for (const client of clientNames) {
    await prisma.client.create({
      data: {
        practitionerId: junior.id,
        firstName: client.firstName,
        lastName: client.lastName,
        presentingConcern: client.concern,
        status: client.status,
      },
    });
  }

  console.log("Seed completed successfully!");
  console.log("---");
  console.log("Admin:      admin@mindstack.in / Admin123!");
  console.log("Supervisor: dr.anand@example.com / Supervisor123!");
  console.log("Junior:     priya.sharma@example.com / Junior123!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
