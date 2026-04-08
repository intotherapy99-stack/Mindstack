"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/utils";
import {
  Search,
  MapPin,
  ShieldCheck,
  Briefcase,
  IndianRupee,
  UserSearch,
  X,
  Heart,
} from "lucide-react";
import { IllustrationDiverseGroup } from "@/components/inclusive-illustrations";

interface Therapist {
  displayName: string;
  slug: string | null;
  avatarUrl: string | null;
  city: string | null;
  specializations: string[];
  sessionFee: number | null;
  yearsExperience: number | null;
  verificationStatus: string;
}

export default function FindTherapist() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/client-dashboard/therapists")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load therapists");
        return res.json();
      })
      .then((data) => setTherapists(data.therapists || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => { if (t.city) set.add(t.city); });
    return Array.from(set).sort();
  }, [therapists]);

  const allSpecs = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.specializations.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [therapists]);

  const filtered = useMemo(() => {
    return therapists.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        t.displayName.toLowerCase().includes(q) ||
        t.specializations.some((s) => s.toLowerCase().includes(q));
      const matchesCity =
        selectedCity === "all" || t.city === selectedCity;
      const matchesSpecs =
        selectedSpecs.length === 0 ||
        selectedSpecs.some((s) => t.specializations.includes(s));
      return matchesSearch && matchesCity && matchesSpecs;
    });
  }, [therapists, searchQuery, selectedCity, selectedSpecs]);

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 page-enter">
        <div className="skeleton h-11 w-full rounded-xl mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="skeleton h-10 w-32 rounded-lg" />
          <div className="skeleton h-10 w-24 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 page-enter">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-500 mb-4">Could not load therapists.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 page-enter">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-50 via-white to-purple-50 rounded-2xl p-5 mb-5 relative overflow-hidden border border-primary-100/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <Heart size={18} className="text-primary-500" />
              Find a Therapist
            </h1>
            <p className="text-sm text-neutral-500">Find the right match for your wellness journey</p>
          </div>
          <div className="hidden sm:block shrink-0 opacity-80">
            <IllustrationDiverseGroup width={140} height={90} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex items-start gap-2 mb-5">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 no-scrollbar">
          {allSpecs.map((spec) => (
            <button
              key={spec}
              onClick={() => toggleSpec(spec)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[36px] ${
                selectedSpecs.includes(spec)
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {spec}
              {selectedSpecs.includes(spec) && (
                <X size={12} className="inline ml-1 -mr-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <UserSearch size={40} className="text-neutral-300 mx-auto mb-3" />
            <p className="font-medium text-neutral-700 mb-1">No therapists found</p>
            <p className="text-sm text-neutral-500">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((t) => (
            <Card key={t.slug || t.displayName} className="card-lift card-press">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-base font-bold text-primary-700">
                      {t.displayName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm text-neutral-900 truncate">
                        {t.displayName}
                      </p>
                      {t.verificationStatus === "VERIFIED" && (
                        <ShieldCheck size={14} className="text-green-500 shrink-0" />
                      )}
                    </div>
                    {t.city && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} />
                        {t.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Specializations */}
                {t.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {t.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="default" className="text-[10px]">
                        {spec}
                      </Badge>
                    ))}
                    {t.specializations.length > 3 && (
                      <Badge variant="unverified" className="text-[10px]">
                        +{t.specializations.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4 text-xs text-neutral-500">
                  {t.sessionFee != null && t.sessionFee > 0 && (
                    <span className="flex items-center gap-1">
                      <IndianRupee size={12} />
                      {formatINR(t.sessionFee)}
                    </span>
                  )}
                  {t.yearsExperience != null && t.yearsExperience > 0 && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} />
                      {t.yearsExperience} yrs exp
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {t.slug && (
                    <>
                      <Link href={`/book/${t.slug}`} className="flex-1">
                        <Button size="sm" className="w-full min-h-[44px]">
                          Book Session
                        </Button>
                      </Link>
                      <Link href={`/dr/${t.slug}`} className="flex-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full min-h-[44px]"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
