export const SPECIALIZATIONS = [
  "Anxiety",
  "Depression",
  "OCD",
  "Trauma & PTSD",
  "Eating Disorders",
  "Grief",
  "Addiction",
  "Relationship Issues",
  "Child & Adolescent",
  "Couples",
  "ADHD",
  "Autism",
  "Psychosis",
  "Career & Burnout",
] as const;

export const THERAPY_MODALITIES = [
  "CBT",
  "DBT",
  "EMDR",
  "ACT",
  "Psychodynamic",
  "Humanistic",
  "Narrative",
  "IFS",
  "Art Therapy",
  "Play Therapy",
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Chandigarh",
  "Puducherry",
] as const;

export const LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Odia",
  "Urdu",
  "Assamese",
] as const;

export const PROFESSIONAL_ROLES = {
  PSYCHIATRIST: {
    label: "Psychiatrist",
    description: "MD/DNB in Psychiatry, prescribing practice",
    icon: "Brain",
  },
  CLINICAL_PSYCHOLOGIST: {
    label: "Clinical Psychologist",
    description: "Assessment, diagnosis & therapy",
    icon: "Microscope",
  },
  COUNSELOR: {
    label: "Counselor / Therapist",
    description: "MA/MSc Psychology, counseling practice",
    icon: "MessageCircle",
  },
  THERAPIST: {
    label: "Therapist",
    description: "Licensed therapy practice",
    icon: "Heart",
  },
  STUDENT_TRAINEE: {
    label: "Student / Trainee",
    description: "Currently in training, seeking supervision",
    icon: "GraduationCap",
  },
} as const;

export const SUBSCRIPTION_LIMITS = {
  FREE: {
    maxClients: 5,
    maxAppointmentsPerMonth: 10,
    maxSupervisionSessionsPerMonth: 1,
    hasPaymentTracking: false,
    hasAnalytics: false,
    hasNotesExport: false,
  },
  SOLO: {
    maxClients: Infinity,
    maxAppointmentsPerMonth: Infinity,
    maxSupervisionSessionsPerMonth: Infinity,
    hasPaymentTracking: true,
    hasAnalytics: true,
    hasNotesExport: true,
  },
  SOLO_ANNUAL: {
    maxClients: Infinity,
    maxAppointmentsPerMonth: Infinity,
    maxSupervisionSessionsPerMonth: Infinity,
    hasPaymentTracking: true,
    hasAnalytics: true,
    hasNotesExport: true,
  },
  CLINIC: {
    maxClients: Infinity,
    maxAppointmentsPerMonth: Infinity,
    maxSupervisionSessionsPerMonth: Infinity,
    hasPaymentTracking: true,
    hasAnalytics: true,
    hasNotesExport: true,
  },
} as const;

export const CANCELLATION_POLICY = {
  freeBeforeHours: 24,
  chargeWithin24hPercent: 50,
} as const;

export const PLATFORM_COMMISSION_PERCENT = 12;

export const SUPERVISION_FEE_RANGE = { min: 800, max: 5000 } as const;
