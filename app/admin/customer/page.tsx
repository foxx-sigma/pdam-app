'use client';
import { useState, useEffect } from "react";
import type { Customer } from "@/types/customer";
import AddCustomer from "./add";
import EditCustomer from "./edit";
import DeleteCustomer from "./delete";
import { ResetPassword } from "./reset-password";
import { Users, UserCheck, Phone, MapPin, RefreshCw, Key } from "lucide-react";
import Search from "@/components/Search";
import SimplePagination from "@/components/Pagination";

type ResultData = {
  success: boolean;
  message: string;
  data: Customer[];
  count: number;
};

type Props = {
  searchParams: Promise<{
    page?: number;
    quantity?: number;
    search?: string;
  }>;
};

async function getCustomers(
  search: string = "",
  page: number = 1,
  quantity: number = 10
): Promise<{ data: Customer[]; count: number }> {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?search=${search}&page=${page}&quantity=${quantity}`,
      {
        headers: {
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result: ResultData = await response.json();
    if (!response.ok) return { data: [], count: 0 };
    return { data: result.data, count: result.count };
  } catch (error) {
    console.error("Fetch customers error:", error);
    return { data: [], count: 0 };
  }
}

function formatPhone(phone: string): string {
  if (phone.length >= 10) {
    return phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
  }
  return phone;
}

const glassCard = {
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
};

export default function CustomerPage({ searchParams }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resetPasswordCustomer, setResetPasswordCustomer] = useState<Customer | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuantity, setCurrentQuantity] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await searchParams;
      const page = resolvedParams?.page || 1;
      const quantity = resolvedParams?.quantity || 10;
      const search = resolvedParams?.search || "";

      setCurrentPage(Number(page));
      setCurrentQuantity(Number(quantity));
      setCurrentSearch(search);

      setLoading(true);
      const result = await getCustomers(search, Number(page), Number(quantity));
      setCustomers(result.data);
      setCount(result.count);
      setLoading(false);
    };
    fetchData();
  }, [searchParams]);

  const totalServices = new Set(customers.map((c) => c.service_id)).size;
  const activeCustomers = customers.filter((c) => c.user.role === "CUSTOMER").length;
  const inactiveCustomers = customers.filter((c) => c.user.role !== "CUSTOMER").length;

  const handleResetPasswordSuccess = () => {
    const fetchData = async () => {
      const result = await getCustomers(currentSearch, currentPage, currentQuantity);
      setCustomers(result.data);
    };
    fetchData();
  };

  const statCards = [
    {
      label: "Total Pelanggan",
      value: count,
      sub: "Semua pelanggan terdaftar",
      icon: <Users className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(99,102,241,0.85),rgba(139,92,246,0.85))",
      glow: "rgba(99,102,241,0.3)",
    },
    {
      label: "Akun Aktif",
      value: activeCustomers,
      sub: "Dapat login ke sistem",
      icon: <UserCheck className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))",
      glow: "rgba(16,185,129,0.3)",
    },
    {
      label: "Paket Layanan",
      value: totalServices,
      sub: "Jenis layanan berbeda",
      icon: <MapPin className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(59,130,246,0.85),rgba(99,102,241,0.85))",
      glow: "rgba(59,130,246,0.3)",
    },
    {
      label: "Akun Nonaktif",
      value: inactiveCustomers,
      sub: "Tidak dapat login",
      icon: <Phone className="w-5 h-5 text-white" />,
      grad: "linear-gradient(135deg,rgba(251,146,60,0.85),rgba(245,101,3,0.85))",
      glow: "rgba(251,146,60,0.3)",
    },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#1e1b4b", letterSpacing: "-0.02em" }}
          >
            Manajemen Pelanggan
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(99,102,241,0.7)" }}>
            Kelola data pelanggan PDAM
          </p>
        </div>
        <AddCustomer />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={glassCard}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.grad, boxShadow: `0 4px 12px ${s.glow}` }}
            >
              {s.icon}
            </div>
            <div>
              <div
                className="text-xl font-bold leading-tight"
                style={{ color: "#1e1b4b" }}
              >
                {s.value}
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: "rgba(99,102,241,0.8)" }}
              >
                {s.label}
              </div>
              <div className="text-xs" style={{ color: "rgba(107,114,128,0.7)" }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl" style={glassCard}>
        {/* Toolbar */}
        <div
          className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        >
          <div>
            <h2 className="font-semibold" style={{ color: "#1e1b4b" }}>
              Database Pelanggan
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(107,114,128,0.8)" }}>
              {currentSearch
                ? `Hasil untuk "${currentSearch}" (${customers.length} ditemukan)`
                : "Semua data pelanggan PDAM terdaftar"}
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-60">
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
              search={currentSearch}
              placeholder="Cari pelanggan..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(99,102,241,0.5)"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="rgba(99,102,241,1)"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm" style={{ color: "rgba(99,102,241,0.7)" }}>
                Memuat data pelanggan...
              </p>
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(99,102,241,0.08)" }}
            >
              <Users className="w-8 h-8" style={{ color: "rgba(99,102,241,0.5)" }} />
            </div>
            <p className="font-medium" style={{ color: "#1e1b4b" }}>
              {currentSearch
                ? `Tidak ada pelanggan untuk "${currentSearch}"`
                : "Belum ada pelanggan"}
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(107,114,128,0.7)" }}
            >
              {currentSearch
                ? "Coba kata kunci lain."
                : 'Klik "Tambah Pelanggan" untuk mendaftarkan pelanggan baru.'}
            </p>
            {!currentSearch && (
              <div className="mt-5">
                <AddCustomer />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-b-2xl">
              <table className="w-full text-sm" style={{ minWidth: "860px" }}>
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
                      "Kontak",
                      "Alamat",
                      "Paket Layanan",
                      "Harga",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
                        style={{ color: "rgba(99,102,241,0.7)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(99,102,241,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* No */}
                      <td
                        className="px-3 py-3 font-medium"
                        style={{ color: "#1e1b4b" }}
                      >
                        {(currentPage - 1) * currentQuantity + index + 1}
                      </td>

                      {/* Customer Info — name + username stacked */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))",
                            }}
                          >
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div
                              className="font-medium text-sm truncate max-w-[140px]"
                              style={{ color: "#1e1b4b" }}
                            >
                              {customer.name}
                            </div>
                            <div
                              className="text-xs truncate max-w-[140px]"
                              style={{ color: "rgba(99,102,241,0.7)" }}
                            >
                              @{customer.user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Customer Number */}
                      <td className="px-3 py-3">
                        <code
                          className="text-xs px-2 py-1 rounded-lg whitespace-nowrap"
                          style={{
                            background: "rgba(99,102,241,0.07)",
                            color: "rgba(99,102,241,0.9)",
                          }}
                        >
                          {customer.customer_number}
                        </code>
                      </td>

                      {/* Phone */}
                      <td className="px-3 py-3">
                        <div
                          className="flex items-center gap-1.5 text-xs whitespace-nowrap"
                          style={{ color: "rgba(75,85,99,1)" }}
                        >
                          <Phone
                            className="h-3 w-3 flex-shrink-0"
                            style={{ color: "rgba(99,102,241,0.6)" }}
                          />
                          <span>{formatPhone(customer.phone)}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-3 py-3">
                        <div
                          className="flex items-start gap-1 text-xs max-w-[140px]"
                          style={{ color: "rgba(75,85,99,1)" }}
                        >
                          <MapPin
                            className="h-3 w-3 mt-0.5 flex-shrink-0"
                            style={{ color: "rgba(99,102,241,0.6)" }}
                          />
                          <span className="line-clamp-2">{customer.address}</span>
                        </div>
                      </td>

                      {/* Service Package */}
                      <td className="px-3 py-3">
                        <div>
                          <div
                            className="font-medium text-xs"
                            style={{ color: "#1e1b4b" }}
                          >
                            {customer.service.name}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "rgba(107,114,128,0.7)" }}
                          >
                            {customer.service.min_usage}–{customer.service.max_usage} m³
                          </div>
                        </div>
                      </td>

                      {/* Service Price */}
                      <td
                        className="px-3 py-3 font-semibold text-xs whitespace-nowrap"
                        style={{ color: "rgb(5,150,105)" }}
                      >
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(customer.service.price)}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        {customer.user.role === "CUSTOMER" ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap"
                            style={{
                              background: "rgba(16,185,129,0.1)",
                              color: "rgb(5,150,105)",
                            }}
                          >
                            <UserCheck className="w-3 h-3" />
                            Aktif
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap"
                            style={{
                              background: "rgba(107,114,128,0.1)",
                              color: "rgba(107,114,128,0.9)",
                            }}
                          >
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <EditCustomer customer={customer} />
                          <button
                            onClick={() => setResetPasswordCustomer(customer)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                            title="Reset Password"
                            style={{
                              background: "rgba(99,102,241,0.08)",
                              border: "1px solid rgba(99,102,241,0.2)",
                              color: "rgba(99,102,241,0.8)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(99,102,241,0.16)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                            }}
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <DeleteCustomer customerId={customer.id} />
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
                <SimplePagination
                  currentPage={currentPage}
                  count={count}
                  perPage={currentQuantity}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Reset Password Modal */}
      {resetPasswordCustomer && (
        <ResetPassword
          customerId={resetPasswordCustomer.id}
          customerName={resetPasswordCustomer.name}
          onClose={() => setResetPasswordCustomer(null)}
          onSuccess={handleResetPasswordSuccess}
        />
      )}
    </div>
  );
}