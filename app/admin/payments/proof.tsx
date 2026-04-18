"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

export function PaymentProofPreview({ filename }: { filename: string }) {
  const src = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payment-proof/${filename}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors w-fit"
          style={{
            background: "rgba(99,102,241,0.08)",
            color: "rgba(99,102,241,0.9)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <Eye className="w-3 h-3" />
          Lihat Bukti
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bukti Pembayaran</DialogTitle>
          <DialogDescription>
            Preview foto bukti pembayaran yang diunggah pelanggan.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
          <img
            src={src}
            alt="Bukti Pembayaran"
            className="w-full object-contain max-h-[500px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}