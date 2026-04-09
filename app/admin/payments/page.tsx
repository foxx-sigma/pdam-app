import { cookies } from "next/headers";
import { CheckCircle, Clock, CreditCard, Users, TrendingUp, Eye } from "lucide-react";
import SimplePagination from "@/components/Pagination";
import Search from "@/components/Search";
import VerifyPayment from "./verify"

interface PaymentCustomer {
  id: number;
  name: string;
  customer_number: string;
  phone: string;
}

interface PaymentBill {
  id: number;
  month: number;
  year: number;
  usage_value: number;
  paid: boolean;
  amount: number;
  customer: PaymentCustomer;
}

interface Payment {
  id: number;
  bill_id: number;
  payment_date: string;
  verified: boolean;
  total_amount: number;
  payment_proof: string;
  createdAt: string;
  updatedAt: string;
  bill: PaymentBill;
}

interface ResultData {
  success: boolean;
  message: string;
  data: Payment[];
  count: number;
}

type Props = {
  searchParams: Promise<{ page?: number; quantity?: number; search?: string }>;
};

async function getPayments(page: number, quantity: number, search: string): Promise<ResultData> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("quantity", String(quantity));
    if (search) url.searchParams.set("search", search);

    const response = await fetch(url.toString(), {
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result: ResultData = await response.json();
    if (!response.ok) return { success: false, message: "Failed", data: [], count: 0 };
    return result;
  } catch {
    return { success: false, message: "Error", data: [], count: 0 };
  }
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","Mei","Jun",
  "Jul","Agu","Sep","Okt","Nov","Des",
];

const glassCard = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
};

export default async function PaymentsPage({ searchParams }: Props) {
  const page = Number((await searchParams)?.page || 1);
  const quantity = Number((await searchParams)?.quantity || 10);
  const search = String((await searchParams)?.search || "");

  const { data: payments, count } = await getPayments(page, quantity, search);

  const verifiedCount = payments.filter((p) => p.verified).length;
  const unverifiedCount = payments.filter((p) => !p.verified).length;
  const totalAmount = payments.reduce((s, p) => s + (p.total_amount ?? 0), 0);

  const stats = [
    {
      label: "Total Pembayaran",
      value: count,
      sub: "Semua data",
      icon: <CreditCard className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))",
      glow: "rgba(99,102,241,0.3)",
    },
    {
      label: "Sudah Diverifikasi",
      value: verifiedCount,
      sub: "Pembayaran sah",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))",
      glow: "rgba(16,185,129,0.3)",
    },
    {
      label: "Menunggu Verifikasi",
      value: unverifiedCount,
      sub: "Perlu ditinjau",
      icon: <Clock className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(251,146,60,0.85),rgba(245,101,3,0.85))",
      glow: "rgba(251,146,60,0.3)",
    },
    {
      label: "Total Nominal",
      value: fmtCurrency(totalAmount),
      sub: "Halaman ini",
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(56,189,248,0.85),rgba(14,165,233,0.85))",
      glow: "rgba(56,189,248,0.3)",
    },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1e1b4b", letterSpacing: "-0.02em" }}>
            Manajemen Pembayaran
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(99,102,241,0.7)" }}>
            Verifikasi bukti pembayaran pelanggan
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 flex items-center gap-4" style={glassCard}>
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

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        <div
          className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        >
          <div>
            <h2 className="font-semibold" style={{ color: "#1e1b4b" }}>
              Daftar Pembayaran
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(107,114,128,0.8)" }}>
              {search
                ? `Hasil untuk "${search}" (${count} ditemukan)`
                : "Semua bukti pembayaran yang masuk"}
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
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none"
            />
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(99,102,241,0.08)" }}
            >
              <CreditCard className="w-8 h-8" style={{ color: "rgba(99,102,241,0.5)" }} />
            </div>
            <p className="font-medium" style={{ color: "#1e1b4b" }}>
              {search ? `Tidak ada pembayaran untuk "${search}"` : "Belum ada pembayaran"}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(107,114,128,0.7)" }}>
              {search ? "Coba kata kunci lain." : "Pembayaran dari customer akan muncul di sini."}
            </p>
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
                      "Tagihan",
                      "Nominal",
                      "Bukti Bayar",
                      "Tanggal",
                      "Status",
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
                  {payments.map((payment, i) => (
                    <tr
                      key={payment.id}
                      className="transition-colors hover:bg-indigo-50/30"
                      style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}
                    >
                      {/* No */}
                      <td className="px-4 py-3.5 font-medium" style={{ color: "#1e1b4b" }}>
                        {(page - 1) * quantity + i + 1}
                      </td>

                      {/* Pelanggan */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))",
                            }}
                          >
                            {(payment.bill?.customer?.name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium" style={{ color: "#1e1b4b" }}>
                              {payment.bill?.customer?.name ?? "-"}
                            </div>
                            <div className="text-xs" style={{ color: "rgba(107,114,128,0.8)" }}>
                              No. {payment.bill?.customer?.customer_number ?? "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tagihan */}
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-xs" style={{ color: "#1e1b4b" }}>
                          {MONTH_NAMES[(payment.bill?.month ?? 1) - 1]} {payment.bill?.year}
                        </div>
                        <div className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>
                          ID: #{payment.bill_id}
                        </div>
                      </td>

                      {/* Nominal */}
                      <td
                        className="px-4 py-3.5 font-semibold"
                        style={{ color: "rgb(5,150,105)" }}
                      >
                        {fmtCurrency(payment.total_amount ?? 0)}
                      </td>

                      {/* Bukti Bayar */}
                      <td className="px-4 py-3.5">
                        {payment.payment_proof ? (
                          <a
                            href={`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/proof/${payment.payment_proof}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors w-fit"
                            style={{
                              background: "rgba(99,102,241,0.08)",
                              color: "rgba(99,102,241,0.9)",
                              border: "1px solid rgba(99,102,241,0.15)",
                            }}
                          >
                            <Eye className="w-3 h-3" />
                            Lihat Bukti
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(107,114,128,0.6)" }}>
                            -
                          </span>
                        )}
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-3.5 text-xs" style={{ color: "rgba(75,85,99,1)" }}>
                        {fmtDate(payment.payment_date || payment.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {payment.verified ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={{
                              background: "rgba(16,185,129,0.1)",
                              color: "rgb(5,150,105)",
                            }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Terverifikasi
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={{
                              background: "rgba(251,146,60,0.1)",
                              color: "rgb(234,88,12)",
                            }}
                          >
                            <Clock className="w-3 h-3" />
                            Menunggu
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        {!payment.verified && (
                          <VerifyPayment paymentId={payment.id} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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