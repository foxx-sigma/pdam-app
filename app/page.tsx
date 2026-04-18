"use client";

import Link from "next/link";
import { Droplets, Shield, FileText, CreditCard, ArrowRight, ChevronDown, Zap, Users, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-sky-300" />,
      title: "Tagihan Digital",
      desc: "Lihat dan kelola tagihan air bulanan Anda secara real-time dari mana saja.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-violet-300" />,
      title: "Pembayaran Mudah",
      desc: "Proses pembayaran yang cepat dan aman langsung melalui sistem kami.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-300" />,
      title: "Keamanan Terjamin",
      desc: "Data dan transaksi Anda dilindungi dengan enkripsi tingkat tinggi.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-300" />,
      title: "Notifikasi Instan",
      desc: "Dapatkan notifikasi tagihan tepat waktu agar tidak pernah telat bayar.",
    },
    {
      icon: <Users className="w-6 h-6 text-pink-300" />,
      title: "Multi Pengguna",
      desc: "Kelola akun pelanggan dan admin dalam satu platform terintegrasi.",
    },
    {
      icon: <Droplets className="w-6 h-6 text-cyan-300" />,
      title: "Layanan Premium",
      desc: "Berbagai paket layanan air yang dapat disesuaikan dengan kebutuhan Anda.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Pelanggan Aktif" },
    { value: "99.9%", label: "Uptime Sistem" },
    { value: "< 2s", label: "Waktu Respons" },
    { value: "24/7", label: "Dukungan" },
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Global styles ── */}
      <style>{`
        @keyframes float {
          0%,100%{transform:translateY(0) translateX(0)}
          33%{transform:translateY(-20px) translateX(10px)}
          66%{transform:translateY(10px) translateX(-15px)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(32px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes fadeIn {
          from{opacity:0}
          to{opacity:1}
        }
        @keyframes scaleIn {
          from{opacity:0;transform:scale(0.9)}
          to{opacity:1;transform:scale(1)}
        }
        @keyframes pulse-glow {
          0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.4)}
          50%{box-shadow:0 0 40px rgba(99,102,241,0.8),0 0 80px rgba(56,189,248,0.3)}
        }
        @keyframes shimmer-move {
          0%{background-position:200% center}
          100%{background-position:-200% center}
        }
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        .spin-slow{animation:spin-slow 8s linear infinite}
        .fade-up{animation:fadeUp 0.8s ease-out forwards}
        .fade-in{animation:fadeIn 1s ease-out forwards}
        .scale-in{animation:scaleIn 0.6s ease-out forwards}
        .delay-100{animation-delay:0.1s;opacity:0}
        .delay-200{animation-delay:0.2s;opacity:0}
        .delay-300{animation-delay:0.3s;opacity:0}
        .delay-400{animation-delay:0.4s;opacity:0}
        .delay-500{animation-delay:0.5s;opacity:0}
        .delay-600{animation-delay:0.6s;opacity:0}
        .shimmer-text {
          background: linear-gradient(90deg, #c7d2fe, #38bdf8, #a78bfa, #38bdf8, #c7d2fe);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-move 4s linear infinite;
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.3) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
        }
        .btn-primary {
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(99,102,241,0.7) !important;
        }
        .btn-secondary {
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
        }
        .stat-card:hover .stat-value {
          text-shadow: 0 0 20px rgba(99,102,241,0.8);
        }
        .nav-link {
          position: relative;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1.5px;
          background: linear-gradient(90deg,#6366f1,#38bdf8);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .bounce-arrow {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>

      {/* ── Background ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 40%, rgba(56,189,248,0.3) 0%,transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(99,102,241,0.35) 0%,transparent 50%), radial-gradient(ellipse at 55% 85%, rgba(34,211,238,0.2) 0%,transparent 50%), linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0c4a6e 100%)",
        }}
      />

      {/* Floating orbs */}
      <div className="fixed w-[600px] h-[600px] rounded-full top-[-10%] left-[-10%] opacity-20 pointer-events-none z-0" style={{ background: "rgba(99,102,241,0.6)", filter: "blur(100px)", animation: "float 10s ease-in-out infinite" }} />
      <div className="fixed w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-10%] opacity-15 pointer-events-none z-0" style={{ background: "rgba(56,189,248,0.7)", filter: "blur(100px)", animation: "float 13s ease-in-out infinite reverse" }} />
      <div className="fixed w-64 h-64 rounded-full top-[45%] right-[8%] opacity-15 pointer-events-none z-0" style={{ background: "rgba(167,139,250,0.6)", filter: "blur(80px)", animation: "float 15s ease-in-out infinite 3s" }} />

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(15,23,42,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg,rgba(99,102,241,0.9),rgba(56,189,248,0.9))",
                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
              }}
            >
              <Droplets className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl border border-white/20 spin-slow" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PDAM System</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Fitur", href: "#features" },
              { label: "Statistik", href: "#stats" },
              { label: "Tentang", href: "#about" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,1)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Masuk
            </Link>
            <Link
              href="/sign-up"
              className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1 group"
              style={{
                background: "linear-gradient(135deg,rgba(99,102,241,0.9),rgba(56,189,248,0.9))",
                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Daftar Gratis
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 ${visible ? "fade-up" : "opacity-0"}`}
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.35)",
            color: "rgba(199,210,254,0.9)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
          Platform Air Bersih Digital
        </div>

        {/* Headline */}
        <h1
          className={`text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight ${visible ? "fade-up delay-100" : "opacity-0"}`}
          style={{ letterSpacing: "-0.03em" }}
        >
          Kelola Air Bersih
          <br />
          <span className="shimmer-text">Lebih Mudah</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl max-w-2xl mb-10 leading-relaxed ${visible ? "fade-up delay-200" : "opacity-0"}`}
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Platform manajemen PDAM modern yang menghubungkan pelanggan dan admin dalam satu sistem yang cepat, aman, dan mudah digunakan.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row items-center gap-4 ${visible ? "fade-up delay-300" : "opacity-0"}`}>
          <Link
            href="/sign-up"
            id="hero-signup-btn"
            className="btn-primary px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center gap-2 group"
            style={{
              background: "linear-gradient(135deg,rgba(99,102,241,0.9),rgba(56,189,248,0.9))",
              boxShadow: "0 6px 30px rgba(99,102,241,0.5)",
              border: "1px solid rgba(255,255,255,0.2)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            Mulai Sekarang
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/sign-in"
            id="hero-signin-btn"
            className="btn-secondary px-8 py-4 rounded-2xl font-bold text-white text-base"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            Sudah punya akun?
          </Link>
        </div>

        {/* Hero visual — glass dashboard preview */}
        <div
          className={`mt-20 w-full max-w-4xl mx-auto ${visible ? "fade-up delay-400" : "opacity-0"}`}
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
            <div className="flex-1 mx-4">
              <div className="mx-auto w-48 h-5 rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xs flex items-center justify-center h-full" style={{ color: "rgba(255,255,255,0.3)" }}>pdam-system.app/dashboard</span>
              </div>
            </div>
          </div>

          {/* Dashboard mockup content */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Pelanggan", value: "1,248", color: "rgba(99,102,241,0.7)", icon: <Users size={16} /> },
              { label: "Tagihan Bulan Ini", value: "Rp 3.2M", color: "rgba(56,189,248,0.7)", icon: <FileText size={16} /> },
              { label: "Pembayaran", value: "987", color: "rgba(16,185,129,0.7)", icon: <CheckCircle size={16} /> },
              { label: "Layanan Aktif", value: "24", color: "rgba(167,139,250,0.7)", icon: <Zap size={16} /> },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mock chart bar */}
          <div className="px-6 pb-6">
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-xs font-semibold mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Penggunaan Air — 6 Bulan Terakhir</div>
              <div className="flex items-end gap-2 h-16">
                {[40, 65, 50, 80, 70, 90].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-lg" style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, rgba(99,102,241,0.8), rgba(56,189,248,0.4))`,
                    opacity: 0.7 + i * 0.05,
                    transition: "height 0.5s ease",
                  }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Okt", "Nov", "Des", "Jan", "Feb", "Mar"].map((m) => (
                  <span key={m} className="text-xs flex-1 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 bounce-arrow" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="stat-card text-center">
                <div
                  className="stat-value text-4xl font-extrabold mb-2 transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg,#c7d2fe,#38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "rgba(199,210,254,0.9)" }}
            >
              ✦ Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              Dari tagihan hingga pembayaran, semua dikelola dalam satu platform yang terintegrasi dan mudah digunakan.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="card-hover rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / How It Works ── */}
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", color: "rgba(147,197,253,0.9)" }}
            >
              ✦ Cara Kerja
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Mulai Dalam 3 Langkah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Buat Akun",
                desc: "Daftarkan diri Anda dalam hitungan detik. Tidak memerlukan dokumen rumit.",
                color: "rgba(99,102,241,0.8)",
              },
              {
                step: "02",
                title: "Lihat Tagihan",
                desc: "Akses tagihan bulanan Anda secara real-time kapan saja dan di mana saja.",
                color: "rgba(56,189,248,0.8)",
              },
              {
                step: "03",
                title: "Bayar & Selesai",
                desc: "Lakukan pembayaran dengan mudah dan dapatkan bukti bayar digital.",
                color: "rgba(167,139,250,0.8)",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(100%_-_12px)] w-full h-px z-0"
                    style={{ background: "linear-gradient(90deg,rgba(99,102,241,0.4),transparent)" }}
                  />
                )}
                <div
                  className="card-hover rounded-2xl p-7 relative z-10"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="text-3xl font-black mb-4"
                    style={{
                      background: `linear-gradient(135deg,${step.color},rgba(255,255,255,0.3))`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-3xl p-12"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 16px 60px rgba(99,102,241,0.2)",
            }}
          >
            {/* Glow blob */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.2),transparent 70%)" }} />

            <div className="relative z-10">
              <div
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: "linear-gradient(135deg,rgba(99,102,241,0.9),rgba(56,189,248,0.9))",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.5)",
                }}
              >
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
                Siap Memulai?
              </h2>
              <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
                Bergabunglah dengan ribuan pelanggan yang telah mempercayakan pengelolaan air bersih mereka kepada kami.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  id="cta-signup-btn"
                  className="btn-primary px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center gap-2 group"
                  style={{
                    background: "linear-gradient(135deg,rgba(99,102,241,1),rgba(56,189,248,0.9))",
                    boxShadow: "0 6px 30px rgba(99,102,241,0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Daftar Gratis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/sign-in"
                  id="cta-signin-btn"
                  className="btn-secondary px-8 py-4 rounded-2xl font-bold text-white text-base"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(56,189,248,0.8))" }}
            >
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">PDAM System</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} PDAM System. Platform manajemen air bersih digital.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/sign-in" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              Masuk
            </Link>
            <Link href="/sign-up" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}