"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Bill {
  month: number;
  year: number;
  usage_value: number;
  amount: number;
  paid: boolean;
}

interface ChartPoint {
  name: string;
  usage: number;
  amount: number;
}

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function getToken(): string | undefined {
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith("accessToken="))
    ?.split("=")[1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(59,130,246,0.12)",
          padding: "10px 14px",
          fontSize: "12px",
        }}
      >
        <p
          className="font-semibold mb-2"
          style={{ color: "#0c4a6e" }}
        >
          {label}
        </p>
        {payload.map(
          (entry: { name: string; value: number; color: string }) => (
            <p key={entry.name} style={{ color: entry.color }} className="mb-0.5">
              {entry.name === "usage"
                ? `Pemakaian: ${entry.value} m³`
                : `Tagihan: Rp ${entry.value.toLocaleString("id-ID")}rb`}
            </p>
          )
        )}
      </div>
    );
  }
  return null;
};

export default function BillsChart() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    async function fetchBills() {
      try {
        const token = getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me?page=1&quantity=12`,
          {
            headers: {
              "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );
        const result = await res.json();
        if (res.ok && result.data?.length) {
          const sorted: Bill[] = [...result.data].reverse();
          setData(
            sorted.map((b) => ({
              name: `${MONTH_SHORT[b.month - 1]} ${b.year}`,
              usage: b.usage_value ?? 0,
              amount: Math.round((b.amount ?? 0) / 1000),
            }))
          );
        } else {
          setEmpty(true);
        }
      } catch (e) {
        console.error(e);
        setEmpty(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[280px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
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
            Memuat grafik...
          </p>
        </div>
      </div>
    );
  }

  if (empty || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px]">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "rgba(59,130,246,0.08)" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="rgba(59,130,246,0.5)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "#0c4a6e" }}>
            Belum ada data
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(107,114,128,0.7)" }}>
            Data grafik akan muncul setelah ada tagihan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(59,130,246,1)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="rgba(59,130,246,1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="amountGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(16,185,129,1)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="rgba(16,185,129,1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.07)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "rgba(107,114,128,0.75)" }}
          axisLine={{ stroke: "rgba(59,130,246,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "rgba(107,114,128,0.75)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) =>
            value === "usage" ? "Pemakaian (m³)" : "Tagihan (Rp ribuan)"
          }
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
        <Area
          type="monotone"
          dataKey="usage"
          stroke="rgba(59,130,246,0.9)"
          strokeWidth={2.5}
          fill="url(#usageGrad)"
          dot={{ r: 3.5, fill: "rgba(59,130,246,0.9)", strokeWidth: 0 }}
          activeDot={{ r: 5.5, fill: "rgba(59,130,246,1)", strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="rgba(16,185,129,0.9)"
          strokeWidth={2.5}
          fill="url(#amountGrad)"
          dot={{ r: 3.5, fill: "rgba(16,185,129,0.9)", strokeWidth: 0 }}
          activeDot={{ r: 5.5, fill: "rgba(16,185,129,1)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}