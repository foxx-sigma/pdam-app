"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface VerifyPaymentProps {
  paymentId: number;
}

export default function VerifyPayment({ paymentId }: VerifyPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleVerify = async () => {
    if (!confirm("Verifikasi pembayaran ini? Tagihan akan otomatis ditandai lunas.")) return;

    setIsLoading(true);
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("accessToken="))
      ?.split("=")[1];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/${paymentId}`,
        {
          method: "PATCH",
          headers: {
            "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Pembayaran berhasil diverifikasi!");
        setDone(true);
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error(result.message || "Gagal memverifikasi pembayaran.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
        style={{ background: "rgba(16,185,129,0.1)", color: "rgb(5,150,105)" }}
      >
        <CheckCircle className="w-3 h-3" />
        Terverifikasi
      </span>
    );
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isLoading}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all"
      style={{
        background: isLoading
          ? "rgba(16,185,129,0.4)"
          : "linear-gradient(135deg,rgba(16,185,129,0.9),rgba(5,150,105,0.85))",
        boxShadow: isLoading ? "none" : "0 2px 8px rgba(16,185,129,0.3)",
        cursor: isLoading ? "not-allowed" : "pointer",
      }}
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {isLoading ? "Memverifikasi..." : "Verifikasi"}
    </button>
  );
}