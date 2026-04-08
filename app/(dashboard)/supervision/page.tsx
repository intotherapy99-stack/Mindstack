"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, MapPin, Filter, CheckCircle2, Sparkles, Users, GraduationCap, AlertCircle, X } from "lucide-react";
import { SPECIALIZATIONS } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import { IllustrationSupervision } from "@/components/illustrations";
import { IllustrationDiverseGroup, BlobDecoration2 } from "@/components/inclusive-illustrations";
import Link from "next/link";

interface Supervisor {
  id: string;
  displayName: string;
  slug: string;
  avatarUrl: string | null;
  city: string;
  role: string;
  specializations: string[];
  supervisionApproach: string | null;
  supervisionFee: number | null;
  supervisionModality: string | null;
  verificationStatus: string;
  yearsExperience: number | null;
  avgRating: number | null;
  reviewCount: number;
}

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];

export default function SupervisionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");
  const [specFilter, setSpecFilter] = useState(searchParams.get("spec") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [showFilters, setShowFilters] = useState(
    !!(searchParams.get("city") || searchParams.get("spec") || searchParams.get("verified"))
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync filters to URL with debounce for search, immediate for others
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (cityFilter) params.set("city", cityFilter);
      if (specFilter) params.set("spec", specFilter);
      if (verifiedOnly) params.set("verified", "true");
      const query = params.toString();
      router.replace(query ? `?${query}` : "/supervision", { scroll: false });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, cityFilter, specFilter, verifiedOnly]);

  const hasActiveFilters = searchQuery.length > 0 || cityFilter.length > 0 || specFilter.length > 0 || verifiedOnly;

  function clearFilters() {
    setSearchQuery("");
    setCityFilter("");
    setSpecFilter("");
    setVerifiedOnly(false);
    router.replace("/supervision", { scroll: false });
  }

  useEffect(() => {
    fetchSupervisors();
  }, [cityFilter, specFilter, verifiedOnly]);

  async function fetchSupervisors() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cityFilter) params.set("city", cityFilter);
      if (specFilter) params.set("specialization", specFilter);
      if (verifiedOnly) params.set("verified", "true");
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/supervision/supervisors?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch supervisors (${res.status})`);
      }
      const data = await res.json();
      setSupervisors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while loading supervisors");
      setSupervisors([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchSupervisors();
  }

  return (
    <div className="max-w-6xl mx-auto page-enter">
      {/* Header with purple gradient and inclusive illustration */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-20 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={22} className="text-purple-200 section-header-icon" />
              <h1 className="font-heading text-2xl font-bold text-white">
                Find a Supervisor
              </h1>
            </div>
            <p className="text-purple-100 text-sm">
              Browse verified clinical supervisors across India
            </p>
          </div>
          <div className="hidden md:block opacity-30">
            <IllustrationDiverseGroup width={180} height={100} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <Input
            placeholder="Search by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <Button type="submit" variant="supervision" className="h-11">Search</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="h-11"
        >
          <Filter size={16} />
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-neutral-500 hover:text-neutral-700 h-11"
          >
            <X size={14} /> Clear
          </Button>
        )}
      </form>

      {/* Filters — scrollable chips on mobile, dropdowns on larger screens */}
      {showFilters && (
        <Card className="mb-6 border-purple-100">
          <CardContent className="p-4">
            {/* Mobile: scrollable chip filters */}
            <div className="sm:hidden space-y-3">
              <div>
                <Label className="text-xs mb-2 block">City</Label>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  <button
                    type="button"
                    onClick={() => setCityFilter("")}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      !cityFilter
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : "bg-white text-neutral-600 border-neutral-200"
                    }`}
                  >
                    All cities
                  </button>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCityFilter(cityFilter === city ? "" : city)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        cityFilter === city
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-white text-neutral-600 border-neutral-200"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs mb-2 block">Specialization</Label>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  <button
                    type="button"
                    onClick={() => setSpecFilter("")}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      !specFilter
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : "bg-white text-neutral-600 border-neutral-200"
                    }`}
                  >
                    All
                  </button>
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => setSpecFilter(specFilter === spec ? "" : spec)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        specFilter === spec
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-white text-neutral-600 border-neutral-200"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />
                <Label className="text-sm">Verified only</Label>
              </div>
            </div>

            {/* Desktop: dropdowns */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs">City</Label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All cities</SelectItem>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Specialization</Label>
                <Select value={specFilter} onValueChange={setSpecFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All specializations</SelectItem>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                  <Label className="text-sm">Verified only</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {(() => {
        const query = searchQuery.toLowerCase().trim();
        const filteredSupervisors = query
          ? supervisors.filter(
              (s) =>
                s.displayName.toLowerCase().includes(query) ||
                s.specializations.some((spec) =>
                  spec.toLowerCase().includes(query)
                )
            )
          : supervisors;

        return loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 h-64 skeleton" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state text-center py-16">
          <div className="empty-state-icon w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-neutral-600 font-medium">Failed to load supervisors</p>
          <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
            {error}
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => fetchSupervisors()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredSupervisors.length === 0 ? (
        <div className="empty-state text-center py-16">
          <div className="empty-state-icon flex items-center justify-center mx-auto mb-4">
            <IllustrationSupervision width={80} height={80} />
          </div>
          <p className="text-neutral-600 font-medium">No supervisors found</p>
          <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
            Try adjusting your filters or broadening your search to discover more supervisors
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filteredSupervisors.map((supervisor) => (
            <SupervisorCard key={supervisor.id} supervisor={supervisor} />
          ))}
        </div>
      );
      })()}
    </div>
  );
}

function SupervisorCard({ supervisor }: { supervisor: Supervisor }) {
  const initials = supervisor.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="card-lift hover:supervision-glow transition-all duration-200 border-neutral-200 hover:border-purple-200 active:scale-[0.98]">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-purple-100">
            <AvatarImage src={supervisor.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-neutral-900 truncate">
                {supervisor.displayName}
              </p>
              {supervisor.verificationStatus === "VERIFIED" && (
                <CheckCircle2
                  size={14}
                  className="text-green-500 shrink-0"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin size={11} />
              <span>{supervisor.city}</span>
              {supervisor.yearsExperience && (
                <>
                  <span className="mx-1">&middot;</span>
                  <span>{supervisor.yearsExperience} yrs exp</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {supervisor.specializations.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100"
            >
              {spec}
            </span>
          ))}
          {supervisor.specializations.length > 3 && (
            <span className="text-xs text-neutral-400">
              +{supervisor.specializations.length - 3}
            </span>
          )}
        </div>

        {/* Approach excerpt */}
        {supervisor.supervisionApproach && (
          <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
            {supervisor.supervisionApproach}
          </p>
        )}

        {/* Fee and rating */}
        <div className="flex items-center justify-between mb-4 py-2 px-3 bg-neutral-50 rounded-lg">
          <p className="text-sm font-semibold text-neutral-900">
            {supervisor.supervisionFee
              ? `${formatINR(supervisor.supervisionFee)}/session`
              : "Fee not set"}
          </p>
          {supervisor.avgRating && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">
                {supervisor.avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-400">
                ({supervisor.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/dr/${supervisor.slug}`} className="flex-1">
            <Button variant="secondary" className="w-full" size="sm">
              View Profile
            </Button>
          </Link>
          <Link href={`/supervision/book/${supervisor.id}`} className="flex-1">
            <Button variant="supervision" className="w-full" size="sm">
              Book Session
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
