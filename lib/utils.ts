import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// India-specific: Format currency in INR with Indian number system (1,00,000)
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Convert paise to rupees (Razorpay stores in paise)
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

// Convert rupees to paise for Razorpay
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

// Calculate platform fee (12% commission)
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * 0.12);
}

// Time-based greeting for dashboard
export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return `Good morning, ${name}. Here's your day.`;
  if (hour >= 12 && hour < 17) return `Afternoon, ${name}.`;
  if (hour >= 17 && hour < 21) return `Good evening. How did today go?`;
  return `Still here, ${name}? Don't forget to rest.`;
}

// Generate a URL-safe slug from a name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Format phone number for MSG91 (10 digits without country code)
export function formatPhoneForMSG91(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return cleaned.slice(2);
  }
  if (cleaned.length === 10) return cleaned;
  return cleaned;
}

// Format phone for storage (always with +91)
export function formatPhoneForStorage(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) return `+91${cleaned}`;
  return `+${cleaned}`;
}
