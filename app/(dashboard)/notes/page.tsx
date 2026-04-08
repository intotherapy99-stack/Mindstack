"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, FileText, PenLine, BookOpen, AlertCircle, Trash2, Edit2 } from "lucide-react";
import { IllustrationEmptyNotes } from "@/components/illustrations";

interface Note {
  id: string;
  template: string;
  content: any;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  client?: { firstName: string; lastName: string | null } | null;
  appointment?: { scheduledAt: string } | null;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setError(null);
      try {
        const [notesRes, clientsRes] = await Promise.all([
          fetch("/api/notes"),
          fetch("/api/clients"),
        ]);
        if (!notesRes.ok) {
          throw new Error(`Failed to load notes (${notesRes.status})`);
        }
        if (!clientsRes.ok) {
          throw new Error(`Failed to load clients (${clientsRes.status})`);
        }
        const [notesData, clientsData] = await Promise.all([
          notesRes.json(),
          clientsRes.json(),
        ]);
        setNotes(notesData);
        setClients(clientsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong while loading data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = notes.filter((n) => {
    if (!search) return true;
    const clientName = n.client
      ? `${n.client.firstName} ${n.client.lastName || ""}`.toLowerCase()
      : "";
    return (
      clientName.includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );
  });

  function refreshNotes() {
    fetch("/api/notes")
      .then((r) => r.json())
      .then(setNotes);
  }

  async function handleDelete(noteId: string) {
    if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/notes?noteId=${noteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      refreshNotes();
    } catch {
      toast.error("Failed to delete note");
    }
  }

  const templateColor: Record<string, string> = {
    SOAP: "bg-blue-50 text-blue-700 border-blue-100",
    DAP: "bg-green-50 text-green-700 border-green-100",
    FREE_TEXT: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="max-w-5xl mx-auto page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center section-header-icon">
              <PenLine size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-neutral-900">
                Session Notes
              </h1>
              <p className="text-neutral-500 text-xs">
                {notes.length} total notes
              </p>
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen size={18} className="text-amber-500" />
                New Session Note
              </DialogTitle>
            </DialogHeader>
            <NoteEditor
              clients={clients}
              onSave={() => {
                setDialogOpen(false);
                refreshNotes();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <Input
          placeholder="Search by client name or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="h-20 skeleton" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="empty-state text-center py-16">
          <div className="empty-state-icon w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <p className="text-neutral-600 font-medium">Failed to load notes</p>
          <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
            {error}
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state text-center py-16 page-enter">
          <div className="empty-state-icon flex items-center justify-center mx-auto mb-4">
            <IllustrationEmptyNotes width={80} height={80} />
          </div>
          <p className="text-neutral-600 font-medium text-lg">
            {search ? "No notes match your search" : "No notes yet"}
          </p>
          <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto">
            {search
              ? "Try a different search term"
              : "Create your first session note after a client session"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {filtered.map((note) => (
            <Card key={note.id} className="card-lift card-accent transition-all duration-200">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-neutral-900">
                      {note.client
                        ? `${note.client.firstName} ${note.client.lastName || ""}`
                        : "Unlinked note"}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${templateColor[note.template] || "bg-neutral-50 text-neutral-600"}`}>
                      {note.template}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500 flex-wrap">
                    <span>
                      {format(new Date(note.updatedAt), "MMM d, yyyy · h:mm a")}
                    </span>
                    {note.tags.length > 0 && (
                      <>
                        <span>&middot;</span>
                        <span className="text-primary-600">{note.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 self-end sm:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      setEditingNote(note);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit2 size={14} /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setEditingNote(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 size={18} className="text-amber-500" />
              Edit Note
            </DialogTitle>
          </DialogHeader>
          {editingNote && (
            <NoteEditor
              clients={clients}
              onSave={() => {
                setEditDialogOpen(false);
                setEditingNote(null);
                refreshNotes();
              }}
              initialNote={editingNote}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteEditor({
  clients,
  onSave,
  initialNote,
  mode = "create",
}: {
  clients: any[];
  onSave: () => void;
  initialNote?: Note | null;
  mode?: "create" | "edit";
}) {
  const [template, setTemplate] = useState<"SOAP" | "DAP" | "FREE_TEXT">(
    (initialNote?.template as "SOAP" | "DAP" | "FREE_TEXT") || "SOAP"
  );
  const [clientId, setClientId] = useState("");
  const [content, setContent] = useState<Record<string, string>>(
    initialNote?.content || {}
  );
  const [tags, setTags] = useState(
    initialNote?.tags?.join(", ") || ""
  );
  const [saving, setSaving] = useState(false);

  const templateColors: Record<string, string> = {
    SOAP: "data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
    DAP: "data-[state=active]:bg-green-50 data-[state=active]:text-green-700",
    FREE_TEXT: "data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700",
  };

  async function handleSave() {
    setSaving(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (mode === "edit" && initialNote) {
        const res = await fetch("/api/notes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteId: initialNote.id,
            template,
            content,
            tags: tagList,
          }),
        });
        if (!res.ok) throw new Error("Failed to update note");
        toast.success("Note saved");
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: clientId || null,
            template,
            content,
            tags: tagList,
          }),
        });
        if (!res.ok) throw new Error("Failed to create note");
        toast.success("Note saved");
      }
      onSave();
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.firstName} {c.lastName || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Template</Label>
          <Select
            value={template}
            onValueChange={(v) => setTemplate(v as any)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOAP">SOAP</SelectItem>
              <SelectItem value="DAP">DAP</SelectItem>
              <SelectItem value="FREE_TEXT">Free Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {template === "SOAP" && (
        <div className="space-y-3">
          {[
            { key: "subjective", label: "S — Subjective", placeholder: "What the client reported", color: "border-l-blue-400" },
            { key: "objective", label: "O — Objective", placeholder: "Clinician's observations", color: "border-l-green-400" },
            { key: "assessment", label: "A — Assessment", placeholder: "Clinical assessment", color: "border-l-amber-400" },
            { key: "plan", label: "P — Plan", placeholder: "Next steps, homework, referrals", color: "border-l-purple-400" },
          ].map((field) => (
            <div key={field.key} className={`border-l-4 ${field.color} pl-3`}>
              <Label className="text-sm font-semibold">{field.label}</Label>
              <Textarea
                placeholder={field.placeholder}
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                rows={3}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      )}

      {template === "DAP" && (
        <div className="space-y-3">
          {[
            { key: "data", label: "D — Data", placeholder: "Session content", color: "border-l-green-400" },
            { key: "assessment", label: "A — Assessment", placeholder: "Clinical impression", color: "border-l-amber-400" },
            { key: "plan", label: "P — Plan", placeholder: "Next steps", color: "border-l-purple-400" },
          ].map((field) => (
            <div key={field.key} className={`border-l-4 ${field.color} pl-3`}>
              <Label className="text-sm font-semibold">{field.label}</Label>
              <Textarea
                placeholder={field.placeholder}
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                rows={3}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      )}

      {template === "FREE_TEXT" && (
        <div>
          <Label>Session Notes</Label>
          <Textarea
            placeholder="Write your notes here..."
            value={content.text || ""}
            onChange={(e) =>
              setContent((prev) => ({ ...prev, text: e.target.value }))
            }
            rows={8}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label>Tags (comma separated)</Label>
        <Input
          placeholder="anxiety, CBT, homework"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button onClick={handleSave} className="w-full" disabled={saving}>
        {saving ? "Saving..." : mode === "edit" ? "Update Note" : "Save Note"}
      </Button>
    </div>
  );
}
