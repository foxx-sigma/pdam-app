import React from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/admin-template/app-sidebar";
import LogoutButton from "./logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Konten kanan */}
        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto" style={{
          background: "radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.12) 0%,transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(56,189,248,0.1) 0%,transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.08) 0%,transparent 60%), linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#f5f3ff 100%)",
          fontFamily: "'Outfit', sans-serif"
        }}>
          {/* Floating orbs */}
          <div className="fixed top-[-5%] right-[5%] w-64 h-64 rounded-full pointer-events-none" style={{background: "rgba(99,102,241,0.08)", filter: "blur(60px)"}} />
          <div className="fixed bottom-[10%] left-[10%] w-48 h-48 rounded-full pointer-events-none" style={{background: "rgba(56,189,248,0.08)", filter: "blur(50px)"}} />

          {/* Navbar */}
          <nav className="sticky top-0 z-20 px-4 py-3 shrink-0" style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 4px 24px rgba(99,102,241,0.06)"
          }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg" style={{background: "rgba(99,102,241,0.08)"}}>
                  <SidebarTrigger className="hover:bg-indigo-50 rounded-lg transition-colors" />
                </div>
                <div>
                  <h1 className="text-lg font-bold" style={{color: "#1e1b4b", letterSpacing: "-0.02em"}}>Admin Dashboard</h1>
                  <p className="text-xs" style={{color: "rgba(99,102,241,0.7)"}}>Sistem Manajemen PDAM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Notification dot */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer" style={{
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.12)"
                  }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(99,102,241,0.8)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.001M9 11v3.159c0 .538-.214 1.055-.595 1.436L7 17h5m0 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{background: "rgba(239,68,68,1)"}} />
                  </div>
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
                  background: "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(56,189,248,0.8))",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.25)"
                }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                {/* Logout Button */}
                <LogoutButton />
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 px-4 relative z-10 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}