"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteBillProps {
  billId: number;
  customerName?: string;
}

const DeleteBill = ({ billId, customerName }: DeleteBillProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const token = Cookies.get("accessToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/${billId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Tagihan berhasil dihapus");
        router.refresh();
      } else {
        toast.warning(result.message || "Gagal menghapus tagihan");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-400 hover:text-red-600"
          title="Hapus tagihan"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tagihan?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tagihan{" "}
            {customerName ? (
              <>
                untuk <span className="font-semibold">{customerName}</span>
              </>
            ) : (
              `#${billId}`
            )}{" "}
            akan dihapus secara permanen dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBill;
