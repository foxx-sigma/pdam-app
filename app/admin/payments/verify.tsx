"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VerifyPaymentProps {
  paymentId: number;
  customerName?: string;
  amount?: number;
}

export default function VerifyPayment({ paymentId, customerName, amount }: VerifyPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg,rgba(16,185,129,0.9),rgba(5,150,105,0.85))",
            boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.45)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(16,185,129,0.3)")}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Verifikasi
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleVerify}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,185,129,0.1)" }}
              >
                <ShieldCheck className="w-4 h-4" style={{ color: "rgb(5,150,105)" }} />
              </div>
              Verifikasi Pembayaran
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Tagihan akan otomatis ditandai{" "}
              <span className="font-semibold" style={{ color: "rgb(5,150,105)" }}>Lunas</span>{" "}
              setelah diverifikasi.
            </DialogDescription>
          </DialogHeader>

          {/* Info card */}
          <div
            className="rounded-xl p-4 my-4 space-y-2.5"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            {customerName && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "rgba(107,114,128,0.8)" }}>Pelanggan</span>
                <span className="font-semibold" style={{ color: "#1e1b4b" }}>{customerName}</span>
              </div>
            )}
            {amount != null && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "rgba(107,114,128,0.8)" }}>Nominal</span>
                <span className="font-semibold" style={{ color: "rgb(5,150,105)" }}>
                  {fmtCurrency(amount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: "rgba(107,114,128,0.8)" }}>ID Pembayaran</span>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded-lg"
                style={{ background: "rgba(16,185,129,0.1)", color: "rgb(5,150,105)" }}
              >
                #{paymentId}
              </span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-1.5"
              style={{
                background: isLoading
                  ? "rgba(16,185,129,0.4)"
                  : "linear-gradient(135deg,rgba(16,185,129,0.9),rgba(5,150,105,0.85))",
                border: "none",
                color: "white",
                boxShadow: isLoading ? "none" : "0 4px 12px rgba(16,185,129,0.3)",
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              {isLoading ? "Memverifikasi..." : "Ya, Verifikasi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}