"use client";

import { LogOut } from "lucide-react";
import { deleteCookie } from "cookies-next";

export default function LogoutButton() {
  const handleLogout = () => {
    // ✅ Hapus accessToken
    deleteCookie("accessToken");

    // ✅ Hapus userRole juga — penting agar middleware tidak salah baca
    deleteCookie("userRole");

    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.15)",
        color: "rgb(239,68,68)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.15)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <LogOut className="w-4 h-4" />
      Keluar
    </button>
  );
}