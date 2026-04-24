"use client";

import React from "react";
import { Droplets } from "lucide-react";
import Link from "next/link";
import { deleteCookie } from "cookies-next";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{
      background: "radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.18) 0%,transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(16,185,129,0.12) 0%,transparent 50%), linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#f0fdf4 100%)",
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Background orbs */}
      <div className="fixed top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{background:"rgba(59,130,246,0.08)",filter:"blur(80px)"}} />
      <div className="fixed bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none" style={{background:"rgba(16,185,129,0.07)",filter:"blur(60px)"}} />

      <nav className="sticky top-0 z-20 px-6 py-3" style={{
        background:"rgba(255,255,255,0.7)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.6)",
        boxShadow:"0 4px 24px rgba(59,130,246,0.06)"
      }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,rgba(59,130,246,0.85),rgba(16,185,129,0.8))"}}>
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{color:"#0c4a6e",letterSpacing:"-0.02em"}}>Customer Portal</h1>
              <p className="text-xs" style={{color:"rgba(59,130,246,0.6)"}}>PDAM Water System</p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex items-center gap-2">
            <Link
              href="/cust/dashboard"
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{color:"rgba(59,130,246,0.8)",background:"rgba(59,130,246,0.06)",border:"1px solid rgba(59,130,246,0.12)"}}
            >
              Dashboard
            </Link>
            <Link
              href="/cust/bills"
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{color:"rgba(16,185,129,0.9)",background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)"}}
            >
              Tagihan Saya
            </Link>
            <button
              onClick={() => {
               deleteCookie("accessToken");  
  deleteCookie("userRole");    
  window.location.href = "/";
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{color:"rgba(239,68,68,0.8)",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.12)"}}
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-6 px-4 relative z-10">
        {children}
      </main>
    </div>
  );
}