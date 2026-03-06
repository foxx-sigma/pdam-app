'use client';
import React, { useState } from 'react';
import { Users, Droplets, FileText, TrendingUp, Eye, Edit, Receipt, Banknote } from 'lucide-react';
import Link from 'next/link';

interface AdminProfileProps {
  adminData: {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    owner_token: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      username: string;
      password: string;
      role: string;
      owner_token: string;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
  dashboardStats: {
    totalCustomers: number;
    totalServices: number;
    totalBilling: number;
    totalPayments: number;
    recentCustomers: any[];
    pendingBills: any[];
  } | null;
  error: boolean;
}

interface StatCard { title: string; value: string; change: string; icon: React.ReactNode; gradient: string; glow: string; }

export function AdminProfileContent({ adminData, dashboardStats, error }: AdminProfileProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const getStats = (): StatCard[] => {
    const d = dashboardStats;
    return [
      { title: 'Total Pelanggan', value: (d?.totalCustomers ?? 0).toLocaleString('id-ID'), change: '+12.5%', icon: <Users className="w-5 h-5 text-white" />, gradient: 'linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))', glow: 'rgba(99,102,241,0.3)' },
      { title: 'Layanan Aktif', value: (d?.totalServices ?? 0).toLocaleString('id-ID'), change: '+8.2%', icon: <Droplets className="w-5 h-5 text-white" />, gradient: 'linear-gradient(135deg,rgba(56,189,248,0.85),rgba(14,165,233,0.85))', glow: 'rgba(56,189,248,0.3)' },
      { title: 'Total Tagihan', value: (d?.totalBilling ?? 0).toLocaleString('id-ID'), change: '-5.3%', icon: <FileText className="w-5 h-5 text-white" />, gradient: 'linear-gradient(135deg,rgba(251,146,60,0.85),rgba(245,101,3,0.85))', glow: 'rgba(251,146,60,0.3)' },
      { title: 'Total Pembayaran', value: (d?.totalPayments ?? 0).toLocaleString('id-ID'), change: '+15.7%', icon: <TrendingUp className="w-5 h-5 text-white" />, gradient: 'linear-gradient(135deg,rgba(52,211,153,0.85),rgba(16,185,129,0.85))', glow: 'rgba(52,211,153,0.3)' },
    ];
  };

  if (error || !adminData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 rounded-3xl" style={{background:"rgba(255,255,255,0.6)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.5)"}}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:"rgba(239,68,68,0.1)"}}>
            <Droplets className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-500">Data admin tidak dapat dimuat.</p>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const initials = adminData.name?.slice(0, 2).toUpperCase() ?? 'AD';

  return (
    <div style={{fontFamily: "'Outfit', sans-serif"}}>
      {/* Welcome banner */}
      <div className="rounded-3xl p-6 mb-6 relative overflow-hidden" style={{
        background: "linear-gradient(135deg,rgba(99,102,241,0.85) 0%,rgba(56,189,248,0.75) 100%)",
        boxShadow: "0 8px 32px rgba(99,102,241,0.25)"
      }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style={{background:"rgba(255,255,255,0.4)",filter:"blur(30px)",transform:"translate(20%,-20%)"}} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{background:"rgba(255,255,255,0.25)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.3)"}}>
            {initials}
          </div>
          <div>
            <p className="text-white/70 text-sm mb-0.5">Selamat datang kembali 👋</p>
            <h2 className="text-2xl font-bold text-white" style={{letterSpacing:"-0.02em"}}>{adminData.name}</h2>
            <p className="text-white/60 text-xs mt-0.5">
              {new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300 cursor-default" style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${stat.glow}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: stat.gradient, boxShadow: `0 4px 12px ${stat.glow}`}}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{color:"#1e1b4b"}}>{stat.value}</div>
            <div className="text-xs font-medium" style={{color:"rgba(99,102,241,0.7)"}}>{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Recent & Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Recent customers */}
        <div className="rounded-2xl p-5" style={{background:"rgba(255,255,255,0.55)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.7)",boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(99,102,241,0.1)"}}>
              <Users className="w-4 h-4" style={{color:"rgb(99,102,241)"}} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{color:"#1e1b4b"}}>Pelanggan Terbaru</h3>
              <p className="text-xs" style={{color:"rgba(99,102,241,0.6)"}}>5 pendaftar terakhir</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {dashboardStats?.recentCustomers?.length ? dashboardStats.recentCustomers.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl transition-colors" style={{background:"rgba(99,102,241,0.04)"}}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.04)")}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{background:"linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))"}}>
                    {(c.name || c.customer_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{color:"#1e1b4b"}}>{c.name || c.customer_name || 'Unknown'}</p>
                    <p className="text-xs" style={{color:"rgba(107,114,128,1)"}}>#{c.customer_number || c.id || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg transition-colors" style={{color:"rgba(99,102,241,0.6)"}} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg transition-colors" style={{color:"rgba(99,102,241,0.6)"}} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-center text-sm py-4" style={{color:"rgba(107,114,128,0.8)"}}>Belum ada data pelanggan</p>
            )}
          </div>
        </div>

        {/* Pending bills */}
        <div className="rounded-2xl p-5" style={{background:"rgba(255,255,255,0.55)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.7)",boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(251,146,60,0.1)"}}>
              <Receipt className="w-4 h-4" style={{color:"rgb(234,88,12)"}} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{color:"#1e1b4b"}}>Tagihan Menunggu</h3>
              <p className="text-xs" style={{color:"rgba(234,88,12,0.7)"}}>Perlu ditindaklanjuti</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {dashboardStats?.pendingBills?.length ? dashboardStats.pendingBills.map((bill: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl" style={{background:"rgba(251,146,60,0.05)"}}>
                <div>
                  <p className="text-sm font-medium" style={{color:"#1e1b4b"}}>{bill.customer?.name || 'Unknown'}</p>
                  <p className="text-xs" style={{color:"rgba(234,88,12,0.8)"}}>Menunggu Pembayaran</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{color:"#1e1b4b"}}>{bill.amount ? formatCurrency(bill.amount) : 'Rp 0'}</p>
                  <button className="text-xs px-2 py-0.5 rounded-lg mt-1" style={{background:"rgba(251,146,60,0.1)",color:"rgb(234,88,12)"}}>Kirim</button>
                </div>
              </div>
            )) : (
              <p className="text-center text-sm py-4" style={{color:"rgba(107,114,128,0.8)"}}>Tidak ada tagihan tertunda</p>
            )}
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="rounded-2xl p-5" style={{background:"rgba(255,255,255,0.55)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.7)",boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
        <h3 className="font-semibold text-sm mb-4" style={{color:"#1e1b4b"}}>Informasi Sistem</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {label:"Status Sistem", value:"Online • Normal", color:"rgba(16,185,129,1)", bg:"rgba(16,185,129,0.08)"},
            {label:"Backup Terakhir", value:"Hari ini, 02:00 WIB", color:"rgba(99,102,241,1)", bg:"rgba(99,102,241,0.08)"},
            {label:"Versi Sistem", value:"v2.1.0", color:"rgba(139,92,246,1)", bg:"rgba(139,92,246,0.08)"},
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl" style={{background: item.bg}}>
              <p className="text-xs font-semibold mb-1" style={{color: item.color}}>{item.label}</p>
              <p className="text-sm font-medium" style={{color:"#1e1b4b"}}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}