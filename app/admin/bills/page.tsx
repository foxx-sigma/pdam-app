import { cookies } from "next/headers";
import type { Bill } from "@/types/bill";
import { Receipt, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import Search from "@/components/Search";
import SimplePagination from "@/components/Pagination";
import AddBill from "./add";
import EditBill from "./edit";
import DeleteBill from "./delete";

type ResultData = {
  success: boolean;
  message: string;
  data: Bill[];
  count: number;
};

type Props = {
  searchParams: Promise<{ page?: number; quantity?: number; search?: string }>;
};

async function getBills(
  page: number,
  quantity: number,
  search: string
): Promise<ResultData> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_API_URL}/billings`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("quantity", String(quantity));
    if (search) url.searchParams.set("search", search);

    const response = await fetch(url.toString(), {
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result: ResultData = await response.json();
    if (!response.ok)
      return { success: false, message: result.message ?? "Failed", data: [], count: 0 };
    return result;
  } catch (error) {
    console.error("Error fetching bills:", error);
    return { success: false, message: "Error", data: [], count: 0 };
  }
}

// ── Formatters ────────────────────────────────────────────────────────────────

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const fmtDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Shared style ──────────────────────────────────────────────────────────────

const glassCard = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
};

// ── Status badge (server-safe, no hooks) ─────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "").toLowerCase();

  if (s === "paid" || s === "lunas") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
        style={{ background: "rgba(16,185,129,0.1)", color: "rgb(5,150,105)" }}
      >
        <CheckCircle className="w-3 h-3" />
        Lunas
      </span>
    );
  }
  if (s === "overdue" || s === "terlambat") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
        style={{ background: "rgba(239,68,68,0.1)", color: "rgb(220,38,38)" }}
      >
        <AlertTriangle className="w-3 h-3" />
        Terlambat
      </span>
    );
  }
  // default → unpaid / pending
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
      style={{ background: "rgba(251,146,60,0.1)", color: "rgb(234,88,12)" }}
    >
      <Clock className="w-3 h-3" />
      Belum Lunas
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BillsPage({ searchParams }: Props) {
  const page = Number((await searchParams)?.page || 1);
  const quantity = Number((await searchParams)?.quantity || 10);
  const search = String((await searchParams)?.search || "");

  const { data: bills, count } = await getBills(page, quantity, search);

  const totalAmount = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const paidCount = bills.filter((b) =>
    ["paid", "lunas"].includes((b.status ?? "").toLowerCase())
  ).length;
  const unpaidCount = bills.filter((b) =>
    ["unpaid", "pending", "belum lunas"].includes((b.status ?? "").toLowerCase())
  ).length;

  const stats = [
    {
      label: "Total Tagihan",
      value: count,
      sub: "Semua data tagihan",
      icon: <Receipt className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))",
      glow: "rgba(99,102,241,0.3)",
    },
    {
      label: "Total Nominal",
      value: fmtCurrency(totalAmount),
      sub: "Nilai tagihan halaman ini",
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(52,211,153,0.85),rgba(16,185,129,0.85))",
      glow: "rgba(52,211,153,0.3)",
    },
    {
      label: "Sudah Lunas",
      value: paidCount,
      sub: "Tagihan terbayar",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))",
      glow: "rgba(16,185,129,0.3)",
    },
    {
      label: "Belum Lunas",
      value: unpaidCount,
      sub: "Menunggu pembayaran",
      icon: <Clock className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(251,146,60,0.85),rgba(245,101,3,0.85))",
      glow: "rgba(251,146,60,0.3)",
    },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1e1b4b", letterSpacing: "-0.02em" }}
          >
            Manajemen Tagihan
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(99,102,241,0.7)" }}>
            Kelola data tagihan pelanggan PDAM
          </p>
        </div>
        {/* Create button */}
        <AddBill />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300"
            style={glassCard}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.grad, boxShadow: `0 4px 12px ${s.glow}` }}
            >
              {s.icon}
            </div>
            <div>
              <div className="text-xl font-bold leading-tight" style={{ color: "#1e1b4b" }}>
                {s.value}
              </div>
              <div className="text-sm font-medium" style={{ color: "rgba(99,102,241,0.8)" }}>
                {s.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        {/* Table toolbar */}
        <div
          className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        >
          <div>
            <h2 className="font-semibold" style={{ color: "#1e1b4b" }}>
              Data Tagihan
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(107,114,128,0.8)" }}>
              {search
                ? `Hasil untuk "${search}" (${count} ditemukan)`
                : "Semua rekap tagihan pelanggan PDAM"}
            </p>
          </div>
          <div className="relative w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              fill="none"
              viewBox="0 0 20 20"
              style={{ color: "rgba(99,102,241,0.5)" }}
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
                fill="currentColor"
              />
            </svg>
            <Search
              search={search}
              placeholder="Cari pelanggan..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Empty state */}
        {bills.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(99,102,241,0.08)" }}
            >
              <Receipt className="w-8 h-8" style={{ color: "rgba(99,102,241,0.5)" }} />
            </div>
            <p className="font-medium" style={{ color: "#1e1b4b" }}>
              {search ? `Tidak ada tagihan untuk "${search}"` : "Belum ada data tagihan"}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(107,114,128,0.7)" }}>
              {search ? "Coba kata kunci lain." : "Klik \"Tambah Tagihan\" untuk membuat tagihan pertama."}
            </p>
            {!search && (
              <div className="mt-5">
                <AddBill />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(99,102,241,0.1)",
                      background: "rgba(99,102,241,0.03)",
                    }}
                  >
                    {[
                      "No",
                      "Pelanggan",
                      "No. Pelanggan",
                      "Nominal Tagihan",
                      "Pemakaian",
                      "Status",
                      "Tanggal Tagihan",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                        style={{ color: "rgba(99,102,241,0.7)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill, i) => (
                    <tr
                      key={bill.id}
                      className="transition-colors hover:bg-indigo-50/30"
                      style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}
                    >
                      {/* No */}
                      <td
                        className="px-4 py-3.5 font-medium"
                        style={{ color: "#1e1b4b" }}
                      >
                        {(page - 1) * quantity + i + 1}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))",
                            }}
                          >
                            {(bill.customer?.name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: "#1e1b4b" }}>
                              {bill.customer?.name ?? "-"}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: "rgba(107,114,128,0.8)" }}
                            >
                              ID: {bill.customer_id ?? bill.customer?.id ?? "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Customer number */}
                      <td className="px-4 py-3.5">
                        <code
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{
                            background: "rgba(99,102,241,0.07)",
                            color: "rgba(99,102,241,0.9)",
                          }}
                        >
                          {bill.customer?.customer_number ?? "-"}
                        </code>
                      </td>

                      {/* Amount */}
                      <td
                        className="px-4 py-3.5 font-semibold"
                        style={{ color: "rgb(5,150,105)" }}
                      >
                        {fmtCurrency(bill.amount ?? 0)}
                      </td>

                      {/* Usage */}
                      <td
                        className="px-4 py-3.5"
                        style={{ color: "rgba(75,85,99,1)" }}
                      >
                        {bill.usage != null ? `${bill.usage} m³` : "-"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={bill.status} />
                      </td>

                      {/* Date */}
                      <td
                        className="px-4 py-3.5"
                        style={{ color: "rgba(75,85,99,1)" }}
                      >
                        {fmtDate(bill.billing_date || bill.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <EditBill bill={bill} />
                          <DeleteBill
                            billId={bill.id}
                            customerName={bill.customer?.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {count > 0 && (
              <div
                className="p-4 border-t flex justify-center"
                style={{ borderColor: "rgba(99,102,241,0.08)" }}
              >
                <SimplePagination count={count} perPage={quantity} currentPage={page} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
