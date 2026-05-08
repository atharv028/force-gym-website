"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/members", icon: Users, label: "Members" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/[0.06] bg-slate-900/50 md:flex">
        {/* Brand */}
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_2px_8px_rgba(249,115,22,0.4)]">
              <span className="font-barlow-condensed text-xs font-bold text-white">F1</span>
            </div>
            <div>
              <p className="font-barlow-condensed text-sm font-bold uppercase leading-none tracking-wider text-white">
                Force One
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-500">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                pathname === href
                  ? "bg-orange-500/15 text-orange-300 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.06] p-3">
          <a
            href="/api/auth/logout"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* ── Mobile top nav ── */}
      <div className="border-b border-white/[0.06] bg-slate-900/60 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <span className="font-barlow-condensed text-xs font-bold text-white">F1</span>
            </div>
            <span className="font-barlow-condensed text-sm font-bold uppercase tracking-wider text-white">
              Admin
            </span>
          </div>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </a>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-3">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                pathname === href
                  ? "bg-orange-500/15 text-orange-300"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
