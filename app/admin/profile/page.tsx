"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Shield, Calendar, Clock, Key, Activity, Phone, Pencil, Eye, EyeOff, CheckCircle, AlertCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminUser { id: number; username: string; role: string; createdAt: string; updatedAt: string; }
interface AdminProfile { id: number; user_id: number; name: string; phone: string; createdAt: string; updatedAt: string; user: AdminUser; }

function getToken() {
  return document.cookie.split("; ").find((r)=>r.startsWith("accessToken="))?.split("=")[1];
}
const fmtDate = (d:string) => new Date(d).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
const fmtDateTime = (d:string) => new Date(d).toLocaleString("id-ID",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});

const glassCard = {
  background:"rgba(255,255,255,0.6)", backdropFilter:"blur(16px)",
  WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.7)",
  boxShadow:"0 4px 24px rgba(99,102,241,0.07)"
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(""); const [editPhone, setEditPhone] = useState(""); const [editUsername, setEditUsername] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(""); const [passwordSuccess, setPasswordSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`, { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${getToken()}` } });
      const result = await res.json();
      if (res.ok) { setProfile(result.data); setEditName(result.data.name); setEditPhone(result.data.phone); setEditUsername(result.data.user?.username ?? ""); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSaveProfile = async () => {
    if (!editName.trim()) { toast.warning("Nama tidak boleh kosong"); return; }
    setIsSavingProfile(true);
    try {
      const body: Record<string, string> = { name: editName, phone: editPhone };
      if (editUsername !== profile?.user?.username) body.username = editUsername;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${profile?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.success) { toast.success(result.message || "Profil diperbarui"); setIsEditing(false); fetchProfile(); }
      else toast.warning(result.message || "Gagal memperbarui");
    } catch { toast.error("Terjadi kesalahan"); }
    finally { setIsSavingProfile(false); }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPasswordError(""); setPasswordSuccess(false);
    if (newPassword.length < 6) { setPasswordError("Password minimal 6 karakter"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Password tidak cocok"); return; }
    setIsSavingPassword(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${profile?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ password: newPassword }),
      });
      const result = await res.json();
      if (result.success) { setPasswordSuccess(true); setNewPassword(""); setConfirmPassword(""); setTimeout(() => setPasswordSuccess(false), 3000); }
      else setPasswordError(result.message || "Gagal mengubah password");
    } catch { setPasswordError("Terjadi kesalahan."); }
    finally { setIsSavingPassword(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.5)" strokeWidth="4"/>
        <path className="opacity-75" fill="rgba(99,102,241,1)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  const initials = profile?.name?.slice(0,2).toUpperCase() ?? "AD";

  return (
    <div style={{fontFamily:"'Outfit',sans-serif"}}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{color:"#1e1b4b",letterSpacing:"-0.02em"}}>Profil Saya</h1>
        <p className="text-sm mt-0.5" style={{color:"rgba(99,102,241,0.7)"}}>Kelola informasi akun Anda</p>
      </div>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Avatar card */}
        <div className="rounded-2xl p-7 flex flex-col items-center" style={glassCard}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4" style={{background:"linear-gradient(135deg,rgba(99,102,241,0.85),rgba(56,189,248,0.85))",boxShadow:"0 8px 24px rgba(99,102,241,0.3)"}}>
            {initials}
          </div>
          <h2 className="text-lg font-bold text-center" style={{color:"#1e1b4b"}}>{profile?.name ?? "-"}</h2>
          <p className="text-sm mt-1" style={{color:"rgba(107,114,128,0.8)"}}>@{profile?.user?.username ?? "-"}</p>
          <span className="mt-2.5 text-xs px-3 py-1 rounded-full font-semibold" style={{background:"rgba(99,102,241,0.1)",color:"rgb(99,102,241)"}}>
            {profile?.user?.role ?? "ADMIN"}
          </span>
          <div className="mt-4 pt-4 w-full border-t text-center" style={{borderColor:"rgba(99,102,241,0.1)"}}>
            <p className="text-xs" style={{color:"rgba(107,114,128,0.7)"}}>Member sejak</p>
            <p className="text-xs font-medium mt-0.5" style={{color:"#1e1b4b"}}>{profile ? fmtDate(profile.createdAt) : "-"}</p>
          </div>
          {/* Status badge */}
          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{background:"rgb(16,185,129)"}} />
            <span className="text-xs font-medium" style={{color:"rgb(5,150,105)"}}>Aktif</span>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Account info */}
          <div className="rounded-2xl p-5" style={glassCard}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:"rgba(99,102,241,0.1)"}}>
                  <User className="w-3.5 h-3.5" style={{color:"rgb(99,102,241)"}} />
                </div>
                <h3 className="font-semibold text-sm" style={{color:"#1e1b4b"}}>Informasi Akun</h3>
              </div>
              {!isEditing ? (
                <button onClick={() => { setIsEditing(true); setEditName(profile?.name ?? ""); setEditPhone(profile?.phone ?? ""); setEditUsername(profile?.user?.username ?? ""); }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                  style={{background:"rgba(99,102,241,0.08)",color:"rgb(99,102,241)",border:"1px solid rgba(99,102,241,0.15)"}}
                  onMouseEnter={(e)=>(e.currentTarget.style.background="rgba(99,102,241,0.15)")}
                  onMouseLeave={(e)=>(e.currentTarget.style.background="rgba(99,102,241,0.08)")}
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} disabled={isSavingProfile}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold" style={{background:"rgba(107,114,128,0.08)",color:"rgb(107,114,128)",border:"1px solid rgba(107,114,128,0.15)"}}>
                    <X className="w-3 h-3" /> Batal
                  </button>
                  <button onClick={handleSaveProfile} disabled={isSavingProfile}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold text-white" style={{background:"linear-gradient(135deg,rgba(99,102,241,0.9),rgba(139,92,246,0.9))"}}>
                    <Save className="w-3 h-3" /> {isSavingProfile ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {label:"Nama Lengkap",icon:User,field:"name",value:profile?.name,editValue:editName,setter:setEditName},
                {label:"Telepon",icon:Phone,field:"phone",value:profile?.phone,editValue:editPhone,setter:setEditPhone},
                {label:"Username",icon:User,field:"username",value:profile?.user?.username,editValue:editUsername,setter:setEditUsername},
              ].map(({label,icon:Icon,field,value,editValue,setter}) => (
                <div key={field} className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>{label}</p>
                  {isEditing ? (
                    <Input value={editValue} onChange={(e) => setter(e.target.value)} className="h-8 text-sm" />
                  ) : (
                    <p className="text-sm font-medium flex items-center gap-1.5" style={{color:"#1e1b4b"}}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{color:"rgba(99,102,241,0.5)"}} /> {value ?? "-"}
                    </p>
                  )}
                </div>
              ))}
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Role</p>
                <p className="text-sm font-medium flex items-center gap-1.5" style={{color:"#1e1b4b"}}>
                  <Shield className="w-3.5 h-3.5" style={{color:"rgba(99,102,241,0.5)"}} /> {profile?.user?.role ?? "-"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Bergabung</p>
                <p className="text-sm font-medium flex items-center gap-1.5" style={{color:"#1e1b4b"}}>
                  <Calendar className="w-3.5 h-3.5" style={{color:"rgba(99,102,241,0.5)"}} /> {profile ? fmtDate(profile.createdAt) : "-"}
                </p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Terakhir Diperbarui</p>
                <p className="text-sm font-medium flex items-center gap-1.5" style={{color:"#1e1b4b"}}>
                  <Clock className="w-3.5 h-3.5" style={{color:"rgba(99,102,241,0.5)"}} /> {profile ? fmtDateTime(profile.updatedAt) : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="rounded-2xl p-5" style={glassCard}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:"rgba(251,146,60,0.1)"}}>
                <Key className="w-3.5 h-3.5" style={{color:"rgb(234,88,12)"}} />
              </div>
              <h3 className="font-semibold text-sm" style={{color:"#1e1b4b"}}>Ganti Password</h3>
            </div>

            {passwordSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)"}}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{color:"rgb(5,150,105)"}} />
                <span className="text-sm" style={{color:"rgb(5,150,105)"}}>Password berhasil diubah!</span>
              </div>
            )}
            {passwordError && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)"}}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{color:"rgb(239,68,68)"}} />
                <span className="text-sm" style={{color:"rgb(239,68,68)"}}>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="new-pw" className="text-xs font-semibold uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Password Baru</Label>
                  <div className="relative">
                    <Input id="new-pw" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Min. 6 karakter" required minLength={6} className="h-8 text-sm pr-9" />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2" style={{color:"rgba(107,114,128,0.6)"}}>
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {newPassword && <p className="text-xs">{newPassword.length>=6 ? <span style={{color:"rgb(5,150,105)"}}>✓ Valid</span> : <span style={{color:"rgb(239,68,68)"}}>Min. 6 karakter</span>}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="conf-pw" className="text-xs font-semibold uppercase tracking-wider" style={{color:"rgba(107,114,128,0.7)"}}>Konfirmasi</Label>
                  <Input id="conf-pw" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Ulangi password" required className="h-8 text-sm" />
                  {confirmPassword && <p className="text-xs">{newPassword===confirmPassword ? <span style={{color:"rgb(5,150,105)"}}>✓ Cocok</span> : <span style={{color:"rgb(239,68,68)"}}>Tidak cocok</span>}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isSavingPassword||newPassword.length<6||newPassword!==confirmPassword}
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-semibold text-white transition-all"
                  style={{background:"linear-gradient(135deg,rgba(251,146,60,0.9),rgba(245,101,3,0.9))",boxShadow:"0 4px 16px rgba(251,146,60,0.3)",opacity:(isSavingPassword||newPassword.length<6||newPassword!==confirmPassword)?0.5:1}}>
                  <Key className="w-3.5 h-3.5" />
                  {isSavingPassword ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}