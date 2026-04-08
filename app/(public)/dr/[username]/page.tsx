import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatINR } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Star,
  Clock,
  Video,
  Users,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({
    where: { slug: params.username },
  });

  if (!profile) return { title: "Profile Not Found | MindStack" };

  return {
    title: `${profile.displayName} | MindStack`,
    description: profile.bio || `${profile.displayName} — ${profile.role.toLowerCase().replace("_", " ")} based in ${profile.city}`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const profile = await prisma.profile.findUnique({
    where: { slug: params.username },
    include: {
      user: {
        include: {
          reviewsReceived: {
            where: { isVisible: true },
            include: {
              reviewer: {
                include: { profile: { select: { displayName: true } } },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      },
    },
  });

  if (!profile || !profile.isPublic) notFound();

  const session = await auth();
  const isOwner = session?.user?.id === profile.userId;

  const reviews = profile.user.reviewsReceived;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : null;

  const initials = profile.displayName
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Preview banner for profile owner */}
      {isOwner && (
        <div className="bg-primary-500 text-white px-4 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-sm font-medium">
              You are previewing your public profile
            </span>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 min-h-[44px] gap-2"
              >
                <ArrowLeft size={16} />
                Back to Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Top nav bar */}
      <header className="bg-white border-b border-neutral-200 px-4 md:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xs">M</span>
            </div>
            <span className="font-heading font-bold text-base text-neutral-900">
              MindStack
            </span>
          </Link>
          {isOwner ? (
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-card">
            <AvatarImage src={profile.avatarUrl ?? undefined} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                {profile.displayName}
              </h1>
              {profile.verificationStatus === "VERIFIED" && (
                <CheckCircle2 size={20} className="text-green-500 animate-sparkle" />
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
              <span className="capitalize">
                {profile.role.toLowerCase().replace("_", " ")}
              </span>
              <span className="text-neutral-300">|</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {profile.city}, {profile.state}
              </span>
              {profile.yearsExperience && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span>{profile.yearsExperience} years exp.</span>
                </>
              )}
            </div>

            {avgRating && (
              <div className="flex items-center gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= Math.floor(avgRating);
                  const half = !filled && star === Math.ceil(avgRating) && avgRating % 1 >= 0.25;
                  return (
                    <span key={star} className="relative inline-block w-4 h-4">
                      <Star size={16} className="text-neutral-200 absolute inset-0" />
                      {(filled || half) && (
                        <span className={`absolute inset-0 overflow-hidden ${half ? "w-[50%]" : "w-full"}`}>
                          <Star size={16} className="text-amber-400 fill-amber-400" />
                        </span>
                      )}
                    </span>
                  );
                })}
                <span className="text-sm font-medium text-neutral-700 ml-1">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-neutral-400">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.specializations.map((spec: any) => (
                <Badge key={spec} variant="default">
                  {spec}
                </Badge>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              {profile.bookingPageEnabled && (
                <Link href={`/book/${profile.slug}`}>
                  <Button size="lg">
                    <Calendar size={16} className="mr-2" /> Book a Session
                  </Button>
                </Link>
              )}
              {profile.offersSupervision && (
                <Link href={`/book/${profile.slug}?type=supervision`}>
                  <Button variant="supervision" size="lg">
                    <Users size={16} className="mr-2" /> Book Supervision
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about">
          <TabsList className="bg-white border border-neutral-200 p-1 w-full justify-start overflow-x-auto scrollbar-hide flex-nowrap">
            <TabsTrigger value="about" className="shrink-0">About</TabsTrigger>
            <TabsTrigger value="specializations" className="shrink-0">Specializations</TabsTrigger>
            {profile.offersSupervision && (
              <TabsTrigger value="supervision">Supervision</TabsTrigger>
            )}
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {profile.bio ? (
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-neutral-400 italic">
                    This professional hasn&apos;t added a bio yet.
                  </p>
                )}

                {profile.languages && profile.languages.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <p className="text-sm font-medium text-neutral-600 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang: any) => (
                        <Badge key={lang} variant="unverified">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-neutral-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.sessionFee && (
                    <div>
                      <p className="text-xs text-neutral-400">Session Fee</p>
                      <p className="text-sm font-semibold text-neutral-900">
                        {formatINR(profile.sessionFee)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-neutral-400">Session Duration</p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {profile.sessionDuration} min
                    </p>
                  </div>
                  {profile.verificationStatus === "VERIFIED" && (
                    <div>
                      <p className="text-xs text-neutral-400">Verification</p>
                      <Badge variant="verified" className="mt-0.5">
                        <CheckCircle2 size={10} className="mr-1" /> Verified
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specializations" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm font-medium text-neutral-600 mb-3">
                    Presenting Concerns
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map((spec: any) => (
                      <Badge key={spec} variant="default" className="px-3 py-1">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                {profile.modalities && profile.modalities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-neutral-600 mb-3">
                      Therapy Modalities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.modalities.map((mod: any) => (
                        <Badge key={mod} variant="unverified" className="px-3 py-1">
                          {mod}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {profile.offersSupervision && (
            <TabsContent value="supervision" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="supervision" className="px-3 py-1">
                      Offering Supervision
                    </Badge>
                  </div>
                  {profile.supervisionBio && (
                    <p className="text-neutral-700 leading-relaxed mb-6">
                      {profile.supervisionBio}
                    </p>
                  )}
                  {profile.supervisionApproach && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-neutral-600 mb-1">
                        Supervision Approach
                      </p>
                      <p className="text-neutral-700">{profile.supervisionApproach}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-100">
                    {profile.supervisionFee && (
                      <div>
                        <p className="text-xs text-neutral-400">Fee per Session</p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {formatINR(profile.supervisionFee)}
                        </p>
                      </div>
                    )}
                    {profile.supervisionModality && (
                      <div>
                        <p className="text-xs text-neutral-400">Modality</p>
                        <p className="text-sm font-semibold text-neutral-900 capitalize">
                          {profile.supervisionModality.toLowerCase().replace("_", " ")}
                        </p>
                      </div>
                    )}
                    {profile.maxSuperviseesCount && (
                      <div>
                        <p className="text-xs text-neutral-400">Max Supervisees</p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {profile.maxSuperviseesCount}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="reviews" className="mt-6 space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-neutral-400">No reviews yet</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-neutral-700">{review.comment}</p>
                    )}
                    <p className="text-xs text-neutral-400 mt-2">
                      — {review.reviewer.profile?.displayName || "Anonymous"}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
