"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, X, Loader2, Search, CheckCircle, XCircle } from "lucide-react";

type Member = {
  id: string;
  name: string;
  phone: string;
  joined_on: string | null;
  membership_expires_on: string | null;
  active: boolean | null;
};

function defaultExpiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [expiresOn, setExpiresOn] = useState(defaultExpiryDate());
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  const filteredMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.phone.includes(search),
      ),
    [members, search],
  );

  async function fetchMembers() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/members", { cache: "no-store" });
    const data = (await res.json()) as { members?: Member[]; error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to load members");
      return;
    }
    setMembers(data.members ?? []);
  }

  useEffect(() => {
    void fetchMembers();
  }, []);

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setCreateError("");
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, membership_expires_on: expiresOn || null }),
    });
    const data = (await res.json()) as { error?: string; member?: Member };
    setSubmitting(false);
    if (!res.ok) {
      setCreateError(data.error ?? "Could not create member");
      return;
    }
    setCreateOpen(false);
    setName("");
    setPhone("");
    setExpiresOn(defaultExpiryDate());
    await fetchMembers();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-orange-300">
            Member Management
          </p>
          <h1 className="mt-1 font-barlow-condensed text-4xl font-bold uppercase text-white">
            Members
          </h1>
        </div>
        <button
          onClick={() => {
            setCreateOpen((v) => !v);
            setCreateError("");
          }}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)] transition-all duration-200 hover:brightness-110"
        >
          {createOpen ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Add Member
            </>
          )}
        </button>
      </div>

      {/* Create form */}
      {createOpen && (
        <form
          onSubmit={handleCreateMember}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur"
        >
          <h2 className="mb-4 font-barlow-condensed text-xl font-semibold uppercase text-white">
            Register New Member
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Membership Expires
              </label>
              <input
                type="date"
                value={expiresOn}
                onChange={(e) => setExpiresOn(e.target.value)}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Register Member"
                )}
              </button>
            </div>
          </div>
          {createError && (
            <p className="mt-3 text-sm text-red-400">{createError}</p>
          )}
        </form>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* Members table */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading members…</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-slate-500">
            {search ? "No members match your search." : "No members found. Add your first member above."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                  {["Name", "Phone", "Joined", "Expires", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredMembers.map((m) => {
                  const isExpired =
                    m.membership_expires_on && new Date(m.membership_expires_on) < new Date();
                  return (
                    <tr
                      key={m.id}
                      className="bg-slate-900/30 transition-colors duration-100 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{m.phone}</td>
                      <td className="px-4 py-3 text-slate-400">{m.joined_on ?? "—"}</td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          isExpired ? "text-red-400" : "text-slate-300"
                        }`}
                      >
                        {m.membership_expires_on ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            m.active
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {m.active ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {m.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
            <p className="text-xs text-slate-600">
              Showing {filteredMembers.length} of {members.length} members
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
