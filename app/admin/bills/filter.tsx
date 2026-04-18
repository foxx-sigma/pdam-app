"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function StatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "all"

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("status", value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      className="outline-none text-sm rounded-xl px-3 py-2 transition-all"
      style={{
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.15)",
        color: "#1e1b4b",
      }}
    >
      <option value="all">Semua Status</option>
      <option value="unpaid">Belum Bayar</option>
      <option value="pending">Menunggu Verifikasi</option>
      <option value="paid">Lunas</option>
    </select>
  )
}