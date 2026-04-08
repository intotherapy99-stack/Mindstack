"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "client" | "supervision" | "blocked";
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("week");
  const [error, setError] = useState("");

  // Default to day view on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setView("day");
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const start = startOfMonth(subMonths(currentDate, 1)).toISOString();
      const end = endOfMonth(addMonths(currentDate, 1)).toISOString();

      const res = await fetch(`/api/appointments?start=${start}&end=${end}`);
      if (!res.ok) throw new Error("Failed to load events");
      const appointments = await res.json();

      const mapped: CalendarEvent[] = appointments.map((apt: any) => ({
        id: apt.id,
        title: apt.client
          ? `${apt.client.firstName}${apt.client.lastName ? ` ${apt.client.lastName}` : ""}`
          : "Session",
        start: new Date(apt.scheduledAt),
        end: new Date(
          new Date(apt.scheduledAt).getTime() + (apt.duration || 50) * 60000
        ),
        type: "client" as const,
      }));

      setEvents(mapped);
    } catch (e: any) {
      setError(e.message);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const colors = {
      client: { backgroundColor: "#00979A", borderColor: "#007A7C" },
      supervision: { backgroundColor: "#8B5CF6", borderColor: "#7C3AED" },
      blocked: { backgroundColor: "#D6D5D3", borderColor: "#BFBDBA" },
    };
    const style = colors[event.type] || colors.client;
    return {
      style: {
        ...style,
        color: "white",
        borderRadius: "8px",
        border: `2px solid ${style.borderColor}`,
        fontSize: "12px",
        fontWeight: 500,
        padding: "2px 6px",
      },
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="section-header-icon bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <CalendarIcon size={18} className="text-white" />
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-neutral-900">
            Calendar
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-primary-500" />
            <span className="text-neutral-500 hidden sm:inline">Client</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-supervision" />
            <span className="text-neutral-500 hidden sm:inline">Supervision</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      <Card className="p-3 md:p-4 overflow-hidden">
        <style jsx global>{`
          .rbc-toolbar {
            padding: 0 0 12px;
            flex-wrap: wrap;
            gap: 8px;
          }
          .rbc-toolbar button {
            border-radius: 8px !important;
            border-color: #E8E5E2 !important;
            color: #6B6966 !important;
            font-size: 13px !important;
            padding: 6px 14px !important;
            font-weight: 500 !important;
          }
          .rbc-toolbar button:hover {
            background-color: #F7F5F3 !important;
            border-color: #D6D5D3 !important;
          }
          .rbc-toolbar button.rbc-active {
            background-color: #00979A !important;
            border-color: #00979A !important;
            color: white !important;
          }
          .rbc-toolbar-label {
            font-weight: 700 !important;
            font-size: 16px !important;
            color: #1A1918 !important;
          }
          .rbc-header {
            padding: 8px 4px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            color: #6B6966 !important;
            border-color: #F0EFED !important;
          }
          .rbc-time-header-gutter,
          .rbc-time-gutter {
            font-size: 11px !important;
            color: #9A9895 !important;
          }
          .rbc-day-bg + .rbc-day-bg,
          .rbc-time-content > * + * > * {
            border-color: #F0EFED !important;
          }
          .rbc-today {
            background-color: rgba(0, 151, 154, 0.04) !important;
          }
          .rbc-current-time-indicator {
            background-color: #FF5A42 !important;
            height: 2px !important;
          }
          .rbc-off-range-bg {
            background-color: #FAFAF8 !important;
          }
          @media (max-width: 767px) {
            .rbc-toolbar {
              font-size: 12px;
            }
            .rbc-toolbar button {
              padding: 5px 10px !important;
              font-size: 12px !important;
            }
            .rbc-toolbar-label {
              font-size: 14px !important;
            }
          }
        `}</style>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 240px)", minHeight: "500px" }}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          step={30}
          timeslots={2}
          min={new Date(2024, 0, 1, 7, 0)}
          max={new Date(2024, 0, 1, 22, 0)}
        />
      </Card>
    </div>
  );
}
