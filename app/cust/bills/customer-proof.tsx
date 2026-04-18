"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Eye } from "lucide-react";

export function CustomerProofPreview({ filename }: { filename: string }) {
  const [open, setOpen] = useState(false);
  const src = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payment-proof/${filename}`;

  const modal = open
    ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
            >
              <div>
                <h2 className="text-base font-bold" style={{ color: "#0c4a6e" }}>
                  Bukti Pembayaran
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(107,114,128,0.7)" }}>
                  Foto yang kamu unggah sebagai bukti pembayaran
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Image */}
            <div className="p-4">
              <img
                src={src}
                alt="Bukti Pembayaran"
                className="w-full object-contain rounded-xl"
                style={{ maxHeight: "500px" }}
              />
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3 flex justify-end"
              style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}
            >
              <button
                onClick={() => setOpen(false)}
                className="text-xs px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  color: "rgb(37,99,235)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all w-fit"
        style={{
          background: "rgba(59,130,246,0.08)",
          color: "rgb(37,99,235)",
          border: "1px solid rgba(59,130,246,0.12)",
        }}
      >
        <Eye className="w-3 h-3" />
        Lihat Bukti
      </button>
      {modal}
    </>
  );
}