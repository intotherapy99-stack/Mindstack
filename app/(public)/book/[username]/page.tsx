import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MapPin, Clock, Video } from "lucide-react";
import Link from "next/link";
import { BookingForm } from "@/components/forms/booking-form";
import type { Metadata } from "next";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({
    where: { slug: params.username },
  });
  if (!profile) return { title: "Book | MindStack" };
  return {
    title: `Book with ${profile.displayName} | MindStack`,
  };
}

export default async function BookingPage({ params }: Props) {
  const profile = await prisma.profile.findUnique({
    where: { slug: params.username },
    include: {
      user: {
        include: {
          availability: {
            where: { isActive: true },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
          },
        },
      },
    },
  });

  if (!profile || !profile.bookingPageEnabled) notFound();

  const initials = profile.displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const availability = profile.user.availability;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-200 px-4 md:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xs">M</span>
            </div>
            <span className="font-heading font-bold text-base text-neutral-900">
              MindStack
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
          {/* Practitioner info sidebar */}
          <div>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={profile.avatarUrl ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-neutral-900">
                        {profile.displayName}
                      </p>
                      {profile.verificationStatus === "VERIFIED" && (
                        <CheckCircle2 size={14} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 capitalize">
                      {profile.role.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-neutral-400" />
                    {profile.city}, {profile.state}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-neutral-400" />
                    {profile.sessionDuration} min session
                  </div>
                  {profile.sessionFee && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-xs w-3.5 text-center font-bold">₹</span>
                      {formatINR(profile.sessionFee)} per session
                    </div>
                  )}
                </div>

                {profile.specializations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex flex-wrap gap-1.5">
                      {profile.specializations.slice(0, 5).map((spec: any) => (
                        <Badge key={spec} variant="default" className="text-[10px]">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, idx) => {
                      const slots = availability.filter(
                        (s: any) => s.dayOfWeek === idx
                      );
                      return (
                        <div
                          key={day}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-neutral-500 w-8">{day}</span>
                          {slots.length > 0 ? (
                            <span className="text-neutral-700">
                              {slots
                                .map((s: any) => `${s.startTime}–${s.endTime}`)
                                .join(", ")}
                            </span>
                          ) : (
                            <span className="text-neutral-300">Closed</span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking form */}
          <Card>
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm
                practitionerSlug={profile.slug}
                sessionDuration={profile.sessionDuration}
                sessionFee={profile.sessionFee}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
