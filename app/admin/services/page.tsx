import { cookies } from "next/headers";
import type { Services } from "@/types/services";
import AddServices from "./add";
import EditServices from "./edit";
import DeleteServices from "./delete";
import { Package, TrendingUp, DollarSign, Activity } from "lucide-react";
import Search from "@/components/Search";
import SimplePagination from "@/components/Pagination";

type ResultData = { success: boolean; message: string; data: Services[]; count: number; };
type Props = { searchParams: Promise<{ page?: number; quantity?: number; search?: string; }>; };

async function getService(page: number, quantity: number, search: string): Promise<ResultData> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${page}&quantity=${quantity}&search=${search}`,
      { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "", Authorization: `Bearer ${token}`, "Content-type": "application/json" }, cache: "no-store" }
    );
    const result: ResultData = await response.json();
    if (!response.ok) return { success: false, message: "Failed", data: [], count: 0 };
    return result;
  } catch { return { success: false, message: "Error", data: [], count: 0 }; }
}

const fmtCurrency = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("id-ID").format(n);

const glassCard = {
  background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(99,102,241,0.07)"
};

export default async function ServicePage({ searchParams }: Props) {
  const page = (await searchParams)?.page || 1;
  const quantity = (await searchParams)?.quantity || 10;
  const search = (await searchParams)?.search || "";
  const { data: services, count } = await getService(page, quantity, search);

  const averagePrice = services.reduce((s, x) => s + x.price, 0) / (services.length || 1);
  const totalCapacity = services.reduce((s, x) => s + x.max_usage, 0);
  const activeServices = services.filter((s) => s.max_usage > 0).length;

  const stats = [
    { label: "Total Layanan", value: count, sub: "Paket tersedia", icon: <Package className="w-5 h-5 text-white"/>, grad: "linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))", glow: "rgba(99,102,241,0.3)" },
    { label: "Harga Rata-rata", value: fmtCurrency(averagePrice), sub: "Per layanan", icon: <DollarSign className="w-5 h-5 text-white"/>, grad: "linear-gradient(135deg,rgba(52,211,153,0.85),rgba(16,185,129,0.85))", glow: "rgba(52,211,153,0.3)" },
    { label: "Total Kapasitas", value: `${fmtNum(totalCapacity)} m³`, sub: "Maks. pemakaian", icon: <TrendingUp className="w-5 h-5 text-white"/>, grad: "linear-gradient(135deg,rgba(139,92,246,0.85),rgba(168,85,247,0.85))", glow: "rgba(139,92,246,0.3)" },
    { label: "Layanan Aktif", value: activeServices, sub: "Tersedia sekarang", icon: <Activity className="w-5 h-5 text-white"/>, grad: "linear-gradient(135deg,rgba(251,146,60,0.85),rgba(245,101,3,0.85))", glow: "rgba(251,146,60,0.3)" },
  ];

  return (
    <div style={{fontFamily:"'Outfit',sans-serif"}}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{color:"#1e1b4b",letterSpacing:"-0.02em"}}>Manajemen Layanan</h1>
          <p className="text-sm mt-0.5" style={{color:"rgba(99,102,241,0.7)"}}>Kelola paket layanan PDAM Anda</p>
        </div>
        <AddServices />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300" style={glassCard}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:s.grad,boxShadow:`0 4px 12px ${s.glow}`}}>{s.icon}</div>
            <div>
              <div className="text-xl font-bold leading-tight" style={{color:"#1e1b4b"}}>{s.value}</div>
              <div className="text-sm font-medium" style={{color:"rgba(99,102,241,0.8)"}}>{s.label}</div>
              <div className="text-xs" style={{color:"rgba(107,114,128,0.7)"}}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        <div className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4" style={{borderColor:"rgba(255,255,255,0.5)"}}>
          <div>
            <h2 className="font-semibold" style={{color:"#1e1b4b"}}>Paket Layanan</h2>
            <p className="text-xs mt-0.5" style={{color:"rgba(107,114,128,0.8)"}}>
              {search ? `Hasil untuk "${search}" (${count} ditemukan)` : "Semua paket layanan air"}
            </p>
          </div>
          <div className="relative w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" viewBox="0 0 20 20" style={{color:"rgba(99,102,241,0.5)"}}>
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" fill="currentColor"/>
            </svg>
            <Search search={search} placeholder="Cari layanan..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all duration-200"
            />
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:"rgba(99,102,241,0.08)"}}>
              <Package className="w-8 h-8" style={{color:"rgba(99,102,241,0.5)"}} />
            </div>
            <p className="font-medium" style={{color:"#1e1b4b"}}>{search ? `Tidak ada layanan untuk "${search}"` : "Belum ada layanan"}</p>
            <p className="text-sm mt-1" style={{color:"rgba(107,114,128,0.7)"}}>
              {search ? "Coba kata kunci lain." : "Mulai dengan membuat paket layanan baru."}
            </p>
            {!search && <div className="mt-4"><AddServices /></div>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(99,102,241,0.1)",background:"rgba(99,102,241,0.03)"}}>
                    {["No","Nama Layanan","Min (m³)","Maks (m³)","Harga","Status","Aksi"].map(h=>(
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider" style={{color:"rgba(99,102,241,0.7)"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, i) => (
                    <tr key={service.id} className="transition-colors" style={{borderBottom:"1px solid rgba(99,102,241,0.06)"}}>
                      <td className="px-4 py-3.5 font-medium" style={{color:"#1e1b4b"}}>{(Number(page)-1)*Number(quantity)+i+1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{background:"linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))"}}>
                            {service.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium" style={{color:"#1e1b4b"}}>{service.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5" style={{color:"rgba(75,85,99,1)"}}>{fmtNum(service.min_usage)}</td>
                      <td className="px-4 py-3.5" style={{color:"rgba(75,85,99,1)"}}>{fmtNum(service.max_usage)}</td>
                      <td className="px-4 py-3.5 font-semibold" style={{color:"rgb(5,150,105)"}}>{fmtCurrency(service.price)}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={service.max_usage>0 ? {background:"rgba(16,185,129,0.1)",color:"rgb(5,150,105)"} : {background:"rgba(107,114,128,0.1)",color:"rgb(107,114,128)"}}>
                          {service.max_usage>0 ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <EditServices service={service} />
                          <DeleteServices serviceId={service.id} />
                        </div>
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