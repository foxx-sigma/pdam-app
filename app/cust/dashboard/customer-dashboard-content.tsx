'use client';
import React from 'react';
import { User, Phone, MapPin, Briefcase, Clock, Hash, AtSign, Calendar } from 'lucide-react';

interface CustomerData {
  id: number; user_id: number; customer_number: string; name: string;
  phone: string; address: string; service_id: number; owner_token: string;
  createdAt: string; updatedAt: string;
  user?: { id: number; username: string; role: string; };
  service?: { id: number; name: string; description?: string; };
}

interface Props { customerData: CustomerData | null; error: boolean; }

const glassCard = {
  background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(59,130,246,0.07)"
};

export function CustomerDashboardContent({ customerData, error }: Props) {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (error || !customerData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-10 rounded-3xl" style={glassCard}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:"rgba(239,68,68,0.1)"}}>
            <svg className="w-8 h-8" fill="none" stroke="rgb(239,68,68)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{color:"#0c4a6e"}}>Error</h2>
          <p style={{color:"rgba(107,114,128,0.8)"}}>Data pelanggan tidak dapat dimuat.</p>
        </div>
      </div>
    );
  }

  const initials = customerData.name.charAt(0).toUpperCase();

  return (
    <div style={{fontFamily:"'Outfit',sans-serif"}}>
      {/* Hero banner */}
      <div className="rounded-3xl p-7 mb-6 relative overflow-hidden" style={{
        background: "linear-gradient(135deg,rgba(59,130,246,0.85) 0%,rgba(16,185,129,0.75) 100%)",
        boxShadow: "0 8px 32px rgba(59,130,246,0.25)"
      }}>
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-15" style={{background:"rgba(255,255,255,0.5)",filter:"blur(40px)",transform:"translate(20%,-20%)"}} />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10" style={{background:"rgba(255,255,255,0.5)",filter:"blur(30px)",transform:"translateY(30%)"}} />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{
            background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.3)"
          }}>
            {initials}
          </div>
          <div>
            <p className="text-white/65 text-sm mb-0.5">Profil Pelanggan</p>
            <h1 className="text-2xl font-bold text-white" style={{letterSpacing:"-0.02em"}}>{customerData.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{background:"rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.9)"}}>
                Pelanggan
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full" style={{background:"rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.85)"}}>
                #{customerData.customer_number}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Personal info */}
        <div className="rounded-2xl p-5" style={glassCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(59,130,246,0.1)"}}>
              <User className="w-4 h-4" style={{color:"rgb(59,130,246)"}} />
            </div>
            <h2 className="font-semibold text-sm" style={{color:"#0c4a6e"}}>Informasi Pribadi</h2>
          </div>
          <div className="space-y-3.5">
            {[
              {label:"Nama Lengkap",value:customerData.name,icon:User},
              {label:"Nomor Pelanggan",value:customerData.customer_number,icon:Hash,mono:true},
              {label:"Customer ID",value:`#${customerData.id}`,icon:Hash,mono:true},
              ...(customerData.user ? [{label:"Username",value:customerData.user.username,icon:AtSign}] : []),
            ].map(({label,value,icon:Icon,mono}) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:"rgba(59,130,246,0.06)"}}>
                  <Icon className="w-3.5 h-3.5" style={{color:"rgba(59,130,246,0.7)"}} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>{label}</p>
                  <p className={`text-sm font-medium mt-0.5 ${mono ? 'font-mono' : ''}`} style={{color:"#0c4a6e"}}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div className="rounded-2xl p-5" style={glassCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(16,185,129,0.1)"}}>
              <Phone className="w-4 h-4" style={{color:"rgb(5,150,105)"}} />
            </div>
            <h2 className="font-semibold text-sm" style={{color:"#0c4a6e"}}>Kontak</h2>
          </div>
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:"rgba(16,185,129,0.06)"}}>
                <Phone className="w-3.5 h-3.5" style={{color:"rgba(5,150,105,0.7)"}} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Nomor Telepon</p>
                <p className="text-sm font-medium mt-0.5" style={{color:"#0c4a6e"}}>{customerData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:"rgba(16,185,129,0.06)"}}>
                <MapPin className="w-3.5 h-3.5" style={{color:"rgba(5,150,105,0.7)"}} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Alamat</p>
                <p className="text-sm font-medium mt-0.5 leading-relaxed" style={{color:"#0c4a6e"}}>{customerData.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service & Activity row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Service info */}
        <div className="rounded-2xl p-5" style={glassCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(139,92,246,0.1)"}}>
              <Briefcase className="w-4 h-4" style={{color:"rgb(124,58,237)"}} />
            </div>
            <h2 className="font-semibold text-sm" style={{color:"#0c4a6e"}}>Informasi Layanan</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl" style={{background:"rgba(139,92,246,0.05)"}}>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{color:"rgba(124,58,237,0.7)"}}>Service ID</p>
              <p className="text-sm font-bold font-mono" style={{color:"#0c4a6e"}}>{customerData.service_id}</p>
            </div>
            {customerData.service && (
              <div className="p-3 rounded-xl" style={{background:"rgba(139,92,246,0.05)"}}>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{color:"rgba(124,58,237,0.7)"}}>Nama Layanan</p>
                <p className="text-sm font-bold" style={{color:"#0c4a6e"}}>{customerData.service.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Account activity */}
        <div className="rounded-2xl p-5" style={glassCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(251,146,60,0.1)"}}>
              <Clock className="w-4 h-4" style={{color:"rgb(234,88,12)"}} />
            </div>
            <h2 className="font-semibold text-sm" style={{color:"#0c4a6e"}}>Aktivitas Akun</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{background:"rgba(251,146,60,0.05)"}}>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{color:"rgba(234,88,12,0.7)"}}>Dibuat</p>
              <p className="text-sm font-medium" style={{color:"#0c4a6e"}}>{fmt(customerData.createdAt)}</p>
            </div>
            <div className="p-3 rounded-xl" style={{background:"rgba(251,146,60,0.05)"}}>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{color:"rgba(234,88,12,0.7)"}}>Diperbarui</p>
              <p className="text-sm font-medium" style={{color:"#0c4a6e"}}>{fmt(customerData.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}