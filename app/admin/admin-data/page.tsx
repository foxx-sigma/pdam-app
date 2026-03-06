"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, UserPlus, Trash2, Users, Search as SearchIcon } from "lucide-react";
import SimplePagination from "@/components/Pagination";

interface AdminUser { id: number; username: string; role: string; createdAt: string; updatedAt: string; }
interface Admin { id: number; user_id: number; name: string; phone: string; createdAt: string; updatedAt: string; user: AdminUser; }
interface ResultData { success: boolean; message: string; data: Admin[]; count: number; }

function getToken() {
  return document.cookie.split("; ").find((r) => r.startsWith("accessToken="))?.split("=")[1];
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Glass card helper style
const glassCard = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(99,102,241,0.07)"
};

function AddAdmin({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [username, setUsername] = useState(""); const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const reset = () => { setName(""); setPhone(""); setUsername(""); setPassword(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name, phone, username, password }),
      });
      const result = await response.json();
      if (result.success) { toast.success(result.message || "Admin added"); setOpen(false); reset(); onSuccess(); }
      else toast.warning(result.message || "Failed");
    } catch { toast.error("An unexpected error occurred"); }
    finally { setIsLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200" style={{background:"linear-gradient(135deg,rgba(99,102,241,0.9),rgba(139,92,246,0.9))",border:"1px solid rgba(255,255,255,0.2)",boxShadow:"0 4px 16px rgba(99,102,241,0.3)"}}
          onMouseEnter={(e)=>(e.currentTarget.style.boxShadow="0 6px 24px rgba(99,102,241,0.45)")}
          onMouseLeave={(e)=>(e.currentTarget.style.boxShadow="0 4px 16px rgba(99,102,241,0.3)")}
        >
          <UserPlus className="w-4 h-4" /> Tambah Admin
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Admin Baru</DialogTitle>
            <DialogDescription>Buat akun administrator baru.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Lengkap *</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="John Doe" required /></div>
              <div className="space-y-2"><Label>Telepon *</Label><Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="081234..." required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Username *</Label><Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="admin01" required /></div>
              <div className="space-y-2"><Label>Password *</Label><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Min. 6 karakter" required minLength={6} /></div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan Admin"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAdmin({ admin, onSuccess }: { admin: Admin; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${admin.id}`, {
        method: "DELETE",
        headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${getToken()}` },
      });
      const result = await response.json();
      if (result.success) { toast.success(result.message || "Admin deleted"); setOpen(false); onSuccess(); }
      else toast.warning(result.message || "Failed");
    } catch { toast.error("An unexpected error occurred"); }
    finally { setIsLoading(false); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg transition-all duration-200" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",color:"rgb(239,68,68)"}}
          onMouseEnter={(e)=>(e.currentTarget.style.background="rgba(239,68,68,0.15)")}
          onMouseLeave={(e)=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Admin</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus <span className="font-semibold">{admin.name}</span>? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>{isLoading ? "Menghapus..." : "Hapus"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDataPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const quantity = Number(searchParams.get("quantity")) || 10;
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const fetchAdmins = useCallback(async (searchValue: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins?page=${page}&quantity=${quantity}&search=${searchValue}`,
        { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${getToken()}` }, cache: "no-store" }
      );
      const result: ResultData = await response.json();
      if (result.success) { setAdmins(result.data); setCount(result.count); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, quantity]);

  useEffect(() => { fetchAdmins(searchInput); }, [page, quantity]);
  useEffect(() => {
    const t = setTimeout(() => fetchAdmins(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div style={{fontFamily:"'Outfit',sans-serif"}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{color:"#1e1b4b",letterSpacing:"-0.02em"}}>Data Admin</h1>
          <p className="text-sm mt-0.5" style={{color:"rgba(99,102,241,0.7)"}}>Kelola akun administrator</p>
        </div>
        <AddAdmin onSuccess={() => fetchAdmins(searchInput)} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {label:"Total Admin",value:count,sub:"Terdaftar",icon:<Users className="w-5 h-5 text-white"/>,grad:"linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))",glow:"rgba(99,102,241,0.3)"},
          {label:"Admin Aktif",value:admins.length,sub:"Halaman ini",icon:<Shield className="w-5 h-5 text-white"/>,grad:"linear-gradient(135deg,rgba(56,189,248,0.85),rgba(14,165,233,0.85))",glow:"rgba(56,189,248,0.3)"},
        ].map((s,i) => (
          <div key={i} className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300" style={{...glassCard}}
            onMouseEnter={(e)=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 10px 30px ${s.glow}`;}}
            onMouseLeave={(e)=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(99,102,241,0.07)";}}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:s.grad,boxShadow:`0 4px 12px ${s.glow}`}}>{s.icon}</div>
            <div>
              <div className="text-2xl font-bold" style={{color:"#1e1b4b"}}>{s.value}</div>
              <div className="text-sm font-medium" style={{color:"rgba(99,102,241,0.8)"}}>{s.label}</div>
              <div className="text-xs" style={{color:"rgba(107,114,128,0.8)"}}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        <div className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{borderColor:"rgba(255,255,255,0.5)"}}>
          <div>
            <h2 className="font-semibold" style={{color:"#1e1b4b"}}>Daftar Administrator</h2>
            <p className="text-xs mt-0.5" style={{color:"rgba(107,114,128,0.8)"}}>
              {searchInput ? `Hasil untuk "${searchInput}" (${count} ditemukan)` : "Semua akun admin terdaftar"}
            </p>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:"rgba(99,102,241,0.5)"}} />
            <input
              type="text" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
              placeholder="Cari admin..."
              className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all duration-200 w-64"
              style={{background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.15)",color:"#1e1b4b"}}
              onFocus={(e)=>{e.target.style.background="rgba(99,102,241,0.1)";e.target.style.borderColor="rgba(99,102,241,0.3)";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,0.1)";}}
              onBlur={(e)=>{e.target.style.background="rgba(99,102,241,0.06)";e.target.style.borderColor="rgba(99,102,241,0.15)";e.target.style.boxShadow="none";}}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.5)" strokeWidth="4"/><path className="opacity-75" fill="rgba(99,102,241,1)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <p className="text-sm" style={{color:"rgba(99,102,241,0.7)"}}>Memuat data...</p>
            </div>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:"rgba(99,102,241,0.08)"}}>
              <Users className="w-8 h-8" style={{color:"rgba(99,102,241,0.5)"}} />
            </div>
            <p className="font-medium" style={{color:"#1e1b4b"}}>{searchInput ? `Tidak ada admin untuk "${searchInput}"` : "Belum ada admin"}</p>
            <p className="text-sm mt-1" style={{color:"rgba(107,114,128,0.7)"}}>
              {searchInput ? "Coba kata kunci lain." : "Mulai dengan menambah admin baru."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(99,102,241,0.1)",background:"rgba(99,102,241,0.03)"}}>
                    {["No","Admin","Username","Telepon","Role","Bergabung","Aksi"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{color:"rgba(99,102,241,0.7)"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, i) => (
                    <tr key={admin.id} className="transition-colors" style={{borderBottom:"1px solid rgba(99,102,241,0.06)"}}
                      onMouseEnter={(e)=>(e.currentTarget.style.background="rgba(99,102,241,0.03)")}
                      onMouseLeave={(e)=>(e.currentTarget.style.background="transparent")}
                    >
                      <td className="px-4 py-3.5 font-medium" style={{color:"#1e1b4b"}}>{(page-1)*quantity+i+1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:"linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))"}}>
                            {admin.name?.slice(0,2).toUpperCase() ?? "AD"}
                          </div>
                          <div>
                            <div className="font-medium" style={{color:"#1e1b4b"}}>{admin.name ?? "-"}</div>
                            <div className="text-xs" style={{color:"rgba(107,114,128,0.8)"}}>ID: {admin.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs px-2 py-1 rounded-lg" style={{background:"rgba(99,102,241,0.08)",color:"rgba(99,102,241,1)"}}>
                          {admin.user?.username ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" style={{color:"rgba(75,85,99,1)"}}>{admin.phone ?? "-"}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{background:"rgba(56,189,248,0.1)",color:"rgb(14,165,233)"}}>
                          {admin.user?.role ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm" style={{color:"rgba(107,114,128,1)"}}>{formatDate(admin.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <DeleteAdmin admin={admin} onSuccess={() => fetchAdmins(searchInput)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {count > 0 && (
              <div className="p-4 border-t flex justify-center" style={{borderColor:"rgba(99,102,241,0.08)"}}>
                <SimplePagination count={count} perPage={quantity} currentPage={page} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}