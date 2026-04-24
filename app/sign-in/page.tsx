"use client";

import { setCookie } from "cookies-next";
import { useState } from "react";
import { Eye, EyeOff, Droplets, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

async function handleSignIn(e: React.FormEvent) {
  e.preventDefault();
  setIsLoading(true);
 
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
      },
      body: JSON.stringify({ username, password }),
    });
 
    const responseData = await response.json();
 
    if (!response.ok) {
      toast.error(responseData.message || "Username atau password salah");
      return;
    }
 
    const token = responseData.token || responseData.data?.token;
    const role  = responseData.role  || responseData.data?.role;
 
    // ✅ Simpan accessToken (sudah ada sebelumnya)
    setCookie("accessToken", token, { maxAge: 60 * 60 * 24 });
 
    // ✅ TAMBAHAN: simpan role supaya middleware bisa baca
    setCookie("userRole", role, { maxAge: 60 * 60 * 24 });
 
    toast.success(responseData.message || "Login berhasil! Mengalihkan...");
 
    // Cek apakah ada redirect param (dari middleware)
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get("redirect");
 
    setTimeout(() => {
      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else if (role === "CUSTOMER") {
        window.location.href = "/cust/dashboard";
      }
    }, 800);
 
  } catch (error) {
    toast.error(
      "Terjadi kesalahan saat login: " +
      (error instanceof Error ? error.message : String(error))
    );
  } finally {
    setIsLoading(false);
  }
}
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{fontFamily: "'Outfit', sans-serif"}}>
      {/* Mesh gradient background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.35) 0%,transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.3) 0%,transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(34,211,238,0.25) 0%,transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0c4a6e 100%)"
      }} />

      {/* Floating orbs */}
      <div className="absolute w-80 h-80 rounded-full top-[-5%] left-[-5%] opacity-30" style={{background: "rgba(99,102,241,0.6)", filter: "blur(80px)", animation: "float 8s ease-in-out infinite"}} />
      <div className="absolute w-64 h-64 rounded-full bottom-[10%] right-[-5%] opacity-25" style={{background: "rgba(56,189,248,0.7)", filter: "blur(70px)", animation: "float 10s ease-in-out infinite reverse"}} />
      <div className="absolute w-48 h-48 rounded-full top-[40%] right-[20%] opacity-20" style={{background: "rgba(167,139,250,0.6)", filter: "blur(60px)", animation: "float 12s ease-in-out infinite 2s"}} />

      <style jsx>{`
        @keyframes float {
          0%,100%{transform:translateY(0) translateX(0)}
          33%{transform:translateY(-20px) translateX(10px)}
          66%{transform:translateY(10px) translateX(-15px)}
        }
        @keyframes fadeIn {
          from{opacity:0;transform:translateY(24px)}
          to{opacity:1;transform:translateY(0)}
        }
        .card-enter { animation: fadeIn 0.7s ease-out forwards; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>

      <div className="relative z-10 w-full max-w-md mx-4 card-enter">
        {/* Glass card */}
        <div className="rounded-3xl p-8" style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
        }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative" style={{
              background: "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(56,189,248,0.8))",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
            }}>
              <Droplets className="w-8 h-8 text-white" />
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 spin-slow" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{letterSpacing: "-0.02em"}}>
              PDAM System
            </h1>
            <p className="text-sm" style={{color: "rgba(255,255,255,0.55)"}}>Masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{color: "rgba(255,255,255,0.6)"}}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  fontSize: "0.925rem"
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.15)";
                  e.target.style.borderColor = "rgba(255,255,255,0.35)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{color: "rgba(255,255,255,0.6)"}}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-white/40 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    fontSize: "0.925rem"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.15)";
                    e.target.style.borderColor = "rgba(255,255,255,0.35)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(255,255,255,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color: "rgba(255,255,255,0.4)"}}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded" style={{accentColor: "#6366f1"}} />
              <label htmlFor="remember" className="text-sm" style={{color: "rgba(255,255,255,0.55)"}}>
                Ingat saya
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 group"
              style={{
                background: isLoading
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg,rgba(99,102,241,0.9),rgba(56,189,248,0.9))",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: isLoading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.boxShadow = "0 6px 30px rgba(99,102,241,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)";
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Masuk...
                </span>
              ) : (
                <>
                  Masuk
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{background: "rgba(255,255,255,0.1)"}} />
            <span className="text-xs" style={{color: "rgba(255,255,255,0.3)"}}>ATAU</span>
            <div className="flex-1 h-px" style={{background: "rgba(255,255,255,0.1)"}} />
          </div>

          <p className="text-center text-sm" style={{color: "rgba(255,255,255,0.5)"}}>
            Belum punya akun?{" "}
            <a href="/sign-up" className="font-semibold transition-colors" style={{color: "rgba(147,197,253,1)"}}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(147,197,253,1)")}
            >
              Buat Akun
            </a>
          </p>
        </div>

        {/* Bottom glow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full opacity-30" style={{
          background: "rgba(99,102,241,0.5)",
          filter: "blur(20px)"
        }} />
      </div>
    </div>
  );
}