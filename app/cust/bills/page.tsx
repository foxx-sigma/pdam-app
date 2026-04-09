"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  X,
  FileImage,
  CreditCard,
} from "lucide-react";

interface BillService {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
}

interface BillCustomer {
  id: number;
  name: string;
  customer_number: string;
}

interface Payment {
  id: number;
  bill_id: number;
  file: string;
  verified: boolean;
  createdAt: string;
}

interface Bill {
  id: number;
  customer_id: number;
  month: number;
  year: number;
  measurement_number: string;
  usage_value: number;
  price: number;
  paid: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
  service: BillService;
  customer: BillCustomer;
  payments: Payment | null;
}

interface ResultData {
  success: boolean;
  message: string;
  data: Bill[];
  count: number;
}

function getToken() {
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith("accessToken="))
    ?.split("=")[1];
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const glassCard = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(59,130,246,0.07)",
};

function StatusBadge({ paid, payments }: { paid: boolean; payments: Payment | null }) {
  if (paid) {
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
  if (payments && !paid) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
        style={{ background: "rgba(59,130,246,0.1)", color: "rgb(37,99,235)" }}
      >
        <Clock className="w-3 h-3" />
        Menunggu Verifikasi
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
      style={{ background: "rgba(251,146,60,0.1)", color: "rgb(234,88,12)" }}
    >
      <AlertTriangle className="w-3 h-3" />
      Belum Lunas
    </span>
  );
}

function PaymentDialog({
  bill,
  onSuccess,
}: {
  bill: Bill;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, dll)");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Pilih foto bukti pembayaran terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    const token = getToken();

    const formData = new FormData();
    formData.append("bill_id", String(bill.id));
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments`,
        {
          method: "POST",
          headers: {
            "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Bukti pembayaran berhasil dikirim!");
        setOpen(false);
        setFile(null);
        setPreview(null);
        onSuccess();
      } else {
        toast.error(result.message || "Gagal mengirim bukti pembayaran.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreview(null);
  };

  const modal = open ? createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#0c4a6e" }}>
              Upload Bukti Pembayaran
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(107,114,128,0.8)" }}>
              Tagihan {MONTH_NAMES[(bill.month ?? 1) - 1]} {bill.year} — {fmtCurrency(bill.amount)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File upload area */}
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
            style={{
              borderColor: preview ? "rgba(16,185,129,0.5)" : "rgba(59,130,246,0.3)",
              background: preview ? "rgba(16,185,129,0.04)" : "rgba(59,130,246,0.03)",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded-lg"
                />
                <p className="text-xs font-medium" style={{ color: "rgb(5,150,105)" }}>
                  <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                  {file?.name}
                </p>
                <p className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>
                  Klik untuk ganti foto
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: "rgba(59,130,246,0.1)" }}
                >
                  <FileImage className="w-6 h-6" style={{ color: "rgb(59,130,246)" }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#0c4a6e" }}>
                    Klik untuk upload foto
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(107,114,128,0.7)" }}>
                    JPG, PNG, GIF — Maks. 5MB
                  </p>
                </div>
                <div
                  className="flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg w-fit mx-auto"
                  style={{ background: "rgba(59,130,246,0.08)", color: "rgb(59,130,246)" }}
                >
                  <Upload className="w-3 h-3" />
                  Pilih File
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Bill summary */}
          <div
            className="rounded-xl p-3 space-y-1.5"
            style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)" }}
          >
            <div className="flex justify-between text-xs">
              <span style={{ color: "rgba(107,114,128,0.8)" }}>Pelanggan</span>
              <span className="font-medium" style={{ color: "#0c4a6e" }}>{bill.customer?.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "rgba(107,114,128,0.8)" }}>Periode</span>
              <span className="font-medium" style={{ color: "#0c4a6e" }}>
                {MONTH_NAMES[(bill.month ?? 1) - 1]} {bill.year}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "rgba(107,114,128,0.8)" }}>Pemakaian</span>
              <span className="font-medium" style={{ color: "#0c4a6e" }}>{bill.usage_value} m³</span>
            </div>
            <div
              className="flex justify-between text-xs pt-1 border-t"
              style={{ borderColor: "rgba(59,130,246,0.1)" }}
            >
              <span className="font-semibold" style={{ color: "#0c4a6e" }}>Total Tagihan</span>
              <span className="font-bold" style={{ color: "rgb(5,150,105)" }}>
                {fmtCurrency(bill.amount)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
              style={{ borderColor: "rgba(107,114,128,0.2)", color: "rgba(107,114,128,1)" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !file}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background:
                  isLoading || !file
                    ? "rgba(59,130,246,0.4)"
                    : "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(16,185,129,0.85))",
                cursor: isLoading || !file ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Mengirim..." : "Kirim Bukti Bayar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all"
        style={{
          background: "linear-gradient(135deg,rgba(59,130,246,0.9),rgba(16,185,129,0.85))",
          boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
        }}
      >
        <CreditCard className="w-3.5 h-3.5" />
        Bayar
      </button>
      {modal}
    </>
  );
}

export default function CustomerBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me?page=1&quantity=50`,
        {
          headers: {
            "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      const result: ResultData = await response.json();
      if (result.success || response.ok) {
        setBills(result.data ?? []);
        setCount(result.count ?? 0);
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal memuat data tagihan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const paidCount = bills.filter((b) => b.paid).length;
  const unpaidCount = bills.filter((b) => !b.paid && !b.payments).length;
  const pendingCount = bills.filter((b) => !b.paid && b.payments).length;
  const totalAmount = bills
    .filter((b) => !b.paid)
    .reduce((s, b) => s + (b.amount ?? 0), 0);

  const stats = [
    {
      label: "Total Tagihan",
      value: count,
      sub: "Semua tagihan",
      icon: <Receipt className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(59,130,246,0.85),rgba(99,102,241,0.85))",
      glow: "rgba(59,130,246,0.3)",
    },
    {
      label: "Sudah Lunas",
      value: paidCount,
      sub: "Terbayar",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))",
      glow: "rgba(16,185,129,0.3)",
    },
    {
      label: "Belum Lunas",
      value: unpaidCount,
      sub: "Perlu dibayar",
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(251,146,60,0.85),rgba(245,101,3,0.85))",
      glow: "rgba(251,146,60,0.3)",
    },
    {
      label: "Menunggu Verifikasi",
      value: pendingCount,
      sub: "Sedang diproses",
      icon: <Clock className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))",
      glow: "rgba(99,102,241,0.3)",
    },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#0c4a6e", letterSpacing: "-0.02em" }}
        >
          Tagihan Saya
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(59,130,246,0.7)" }}>
          Kelola dan bayar tagihan air PDAM Anda
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={glassCard}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.grad, boxShadow: `0 4px 12px ${s.glow}` }}
            >
              {s.icon}
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: "#0c4a6e" }}>
                {s.value}
              </div>
              <div className="text-xs font-medium" style={{ color: "rgba(59,130,246,0.8)" }}>
                {s.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert belum lunas */}
      {unpaidCount > 0 && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.2)",
          }}
        >
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "rgb(234,88,12)" }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: "rgb(180,60,0)" }}>
              Anda memiliki {unpaidCount} tagihan belum lunas
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(234,88,12,0.8)" }}>
              Total yang harus dibayar:{" "}
              <strong>{fmtCurrency(totalAmount)}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={glassCard}>
        <div
          className="p-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        >
          <h2 className="font-semibold" style={{ color: "#0c4a6e" }}>
            Riwayat Tagihan
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(107,114,128,0.8)" }}>
            Semua tagihan air PDAM Anda
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="rgba(59,130,246,0.5)"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="rgba(59,130,246,1)"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm" style={{ color: "rgba(59,130,246,0.7)" }}>
                Memuat tagihan...
              </p>
            </div>
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(59,130,246,0.08)" }}
            >
              <Receipt className="w-8 h-8" style={{ color: "rgba(59,130,246,0.5)" }} />
            </div>
            <p className="font-medium" style={{ color: "#0c4a6e" }}>
              Belum ada tagihan
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(107,114,128,0.7)" }}>
              Tagihan akan muncul di sini setelah admin membuatnya.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(59,130,246,0.1)",
                    background: "rgba(59,130,246,0.03)",
                  }}
                >
                  {["No", "Periode", "Pemakaian", "Layanan", "Total Tagihan", "Status", "Aksi"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider"
                        style={{ color: "rgba(59,130,246,0.7)" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <tr
                    key={bill.id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(59,130,246,0.06)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(59,130,246,0.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="px-4 py-3.5 font-medium" style={{ color: "#0c4a6e" }}>
                      {i + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium" style={{ color: "#0c4a6e" }}>
                        {MONTH_NAMES[(bill.month ?? 1) - 1]} {bill.year}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(107,114,128,0.8)" }}>
                        No. Meter: {bill.measurement_number}
                      </div>
                    </td>
                    <td className="px-4 py-3.5" style={{ color: "rgba(75,85,99,1)" }}>
                      {bill.usage_value} m³
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-medium" style={{ color: "#0c4a6e" }}>
                        {bill.service?.name ?? "-"}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>
                        {bill.service?.min_usage}–{bill.service?.max_usage} m³
                      </div>
                    </td>
                    <td
                      className="px-4 py-3.5 font-semibold"
                      style={{ color: "rgb(5,150,105)" }}
                    >
                      {fmtCurrency(bill.amount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge paid={bill.paid} payments={bill.payments} />
                    </td>
                    <td className="px-4 py-3.5">
                      {!bill.paid && !bill.payments ? (
                        <PaymentDialog bill={bill} onSuccess={fetchBills} />
                      ) : bill.payments && !bill.paid ? (
                        <span
                          className="text-xs px-2.5 py-1 rounded-lg"
                          style={{
                            background: "rgba(99,102,241,0.08)",
                            color: "rgba(99,102,241,0.8)",
                          }}
                        >
                          Menunggu admin
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2.5 py-1 rounded-lg"
                          style={{
                            background: "rgba(16,185,129,0.08)",
                            color: "rgb(5,150,105)",
                          }}
                        >
                          ✓ Lunas
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}