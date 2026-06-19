/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { QrCode, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav Links Configuration
  const navLinks = [
    { label: "Matches", href: "/matches", activeCheck: () => pathname === "/matches" },
    { label: "Stades", href: "/stadiums", activeCheck: () => pathname === "/stadiums" },
    { label: "Billetterie 🎫", href: "/tickets", activeCheck: () => pathname === "/tickets" },
    { label: "Volontaires", href: "/volunteer/register", activeCheck: () => pathname.startsWith("/volunteer") },
    { label: "Dashboard", href: "/dashboard", activeCheck: () => pathname === "/dashboard" }
  ];

  return (
    <>
      {/* FIXED HEADER NAVBAR */}
      <header
        id="app-navbar"
        className="fixed top-0 inset-x-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-900/80 z-50 flex items-center justify-between px-6 md:px-12 select-none"
      >
        {/* Left Logo */}
        <Link
          id="nav-logo"
          href="/"
          className="font-display font-black text-lg tracking-wider text-white flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded px-1.5 py-0.5 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        >
          WC 2030 <span className="text-[#34d399] filter drop-shadow">🏆</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {navLinks.map((link, idx) => {
            const isActive = link.activeCheck();
            return (
              <Link
                key={idx}
                id={`nav-${link.label.toLowerCase()}`}
                href={link.href}
                className={`py-1 px-1.5 cursor-pointer transition-all hover:text-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded relative ${
                  isActive ? "text-[#34d399] font-bold" : ""
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#34d399] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Scanner QR Trigger */}
          <Link
            id="nav-scanner"
            href="/scan"
            title="Contrôle des Accès Securisés"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer font-display font-bold text-xs uppercase tracking-widest transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] ${
              pathname === "/scan"
                ? "bg-[#34d399] text-[#0a0a0a] border-white shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                : "bg-zinc-800/60 border-zinc-700/60 text-white hover:bg-zinc-700/80"
            }`}
          >
            <span className="hidden sm:inline">Scanner</span>
            <QrCode className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden text-zinc-400 hover:text-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div
        id="mobile-nav"
        className="fixed bottom-0 inset-x-0 h-14 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-zinc-900 z-50 flex md:hidden items-center justify-around text-[10px] font-semibold text-zinc-500 uppercase select-none px-3 shadow-2xl"
      >
        <Link
          href="/matches"
          className={`flex flex-col items-center gap-0.5 cursor-pointer hover:text-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded transition-all ${
            pathname === "/matches" ? "text-[#34d399]" : ""
          }`}
        >
          <span className="text-base">⚽</span>
          <span>Matchs</span>
        </Link>
        <Link
          href="/stadiums"
          className={`flex flex-col items-center gap-0.5 cursor-pointer hover:text-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded transition-all ${
            pathname === "/stadiums" ? "text-[#34d399]" : ""
          }`}
        >
          <span className="text-base">🏟️</span>
          <span>Stades</span>
        </Link>
        <Link
          href="/tickets"
          className={`flex flex-col items-center gap-0.5 cursor-pointer hover:text-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded transition-all ${
            pathname === "/tickets" ? "text-[#34d399]" : ""
          }`}
        >
          <span className="text-base">🎫</span>
          <span>Billetterie</span>
        </Link>
        <Link
          href="/volunteer/register"
          className={`flex flex-col items-center gap-0.5 cursor-pointer hover:text-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] rounded transition-all ${
            pathname.startsWith("/volunteer") ? "text-[#34d399]" : ""
          }`}
        >
          <span className="text-base">👥</span>
          <span>Volon.</span>
        </Link>
      </div>

      {/* MOBILE HEADER DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="fixed top-16 inset-x-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-900 z-40 flex flex-col p-4 md:hidden gap-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          {navLinks.map((link, idx) => {
            const isActive = link.activeCheck();
            return (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-4 rounded-lg transition-all hover:text-[#34d399] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34d399] ${
                  isActive ? "bg-zinc-900 text-[#34d399] font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
