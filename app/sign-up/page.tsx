"use client";

import { useState } from "react";
import { Eye, EyeOff, Droplets, ArrowRight, User, Phone, Lock, AtSign } from "lucide-react";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: JSON.stringify({ username, password, name, phone }),
      });
      if (!response.ok) { alert("Gagal melakukan registrasi"); return; }
      const responseData = await response.json();
      alert(responseData.message);
      window.location.href = "/sign-in";
    } catch (error) {
      console.log("error during sign up:", error);
    }
  }

  const fields = [
    { id: "username", label: "Username", value: username, setter: setUsername, type: "text", placeholder: "johndoe", icon: AtSign },
    { id: "name", label: "Nama Lengkap", value: name, setter: setName, type: "text", placeholder: "John Doe", icon: User },
    { id: "phone", label: "Nomor Telepon", value: phone, setter: setPhone, type: "tel", placeholder: "08123456789", icon: Phone },
  ];

  const focusStyle = {
    background: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.35)",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.2)"
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-8" style={{fontFamily: "'Outfit', sans-serif"}}>
      {/* Mesh gradient */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.4) 0%,transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(16,185,129,0.3) 0%,transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(139,92,246,0.25) 0%,transparent 45%), linear-gradient(135deg,#0f172a 0%,#0d2439 60%,#071a2e 100%)"
      }} />

      {/* Orbs */}
      <div className="absolute w-96 h-96 rounded-full top-[-10%] right-[-10%] opacity-20" style={{background: "rgba(59,130,246,0.7)", filter: "blur(90px)", animation: "float 9s ease-in-out infinite"}} />
      <div className="absolute w-72 h-72 rounded-full bottom-[-5%] left-[-5%] opacity-20" style={{background: "rgba(16,185,129,0.6)", filter: "blur(70px)", animation: "float 11s ease-in-out infinite 1s reverse"}} />

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
      `}</style>

      <div className="relative z-10 w-full max-w-md mx-4 card-enter">
        <div className="rounded-3xl p-8" style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
        }}>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{
              background: "linear-gradient(135deg,rgba(59,130,246,0.85),rgba(16,185,129,0.85))",
              boxShadow: "0 8px 24px rgba(59,130,246,0.4)"
            }}>
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{letterSpacing: "-0.02em"}}>Buat Akun</h1>
            <p className="text-sm" style={{color: "rgba(255,255,255,0.5)"}}>Daftar ke sistem PDAM</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {fields.map(({ id, label, value, setter, type, placeholder, icon: Icon }) => (
              <div key={id}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{color: "rgba(255,255,255,0.6)"}}>
                  {label}
                </label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: "rgba(255,255,255,0.35)"}} />
                  <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/30 outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontSize: "0.9rem"
                    }}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, {background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", boxShadow:"none"})}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{color: "rgba(255,255,255,0.6)"}}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color: "rgba(255,255,255,0.35)"}} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-white placeholder-white/30 outline-none transition-all duration-200"
                  style={{background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.9rem"}}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, {background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.15)", boxShadow:"none"})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color: "rgba(255,255,255,0.4)"}}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <div
                className="w-4 h-4 rounded mt-0.5 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
                onClick={() => setAgreed(!agreed)}
                style={{
                  background: agreed ? "rgba(99,102,241,0.8)" : "rgba(255,255,255,0.08)",
                  border: agreed ? "1px solid rgba(99,102,241,0.9)" : "1px solid rgba(255,255,255,0.2)"
                }}
              >
                {agreed && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5"><path d="M1 4l2.5 3L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
              </div>
              <label className="text-sm cursor-pointer" style={{color: "rgba(255,255,255,0.5)"}} onClick={() => setAgreed(!agreed)}>
                Saya setuju dengan{" "}
                <span style={{color: "rgba(147,197,253,1)"}}>Syarat & Ketentuan</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 group transition-all duration-200 mt-2"
              style={{
                background: "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(16,185,129,0.85))",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.35)"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 30px rgba(59,130,246,0.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.35)")}
            >
              Daftar Sekarang
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px" style={{background: "rgba(255,255,255,0.1)"}} />
            <span className="text-xs" style={{color: "rgba(255,255,255,0.3)"}}>ATAU</span>
            <div className="flex-1 h-px" style={{background: "rgba(255,255,255,0.1)"}} />
          </div>

          <p className="text-center text-sm" style={{color: "rgba(255,255,255,0.5)"}}>
            Sudah punya akun?{" "}
            <a href="/sign-in" className="font-semibold" style={{color: "rgba(147,197,253,1)"}}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(147,197,253,1)")}
            >
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}