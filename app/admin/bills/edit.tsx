"use client";

import { FormEvent, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Field, FieldGroup } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import type { Bill } from "@/types/bill";

interface EditBillProps {
  bill: Bill;
}

const EditBill = ({ bill }: EditBillProps) => {
  const router = useRouter();

  const [isShowing, setIsShowing] = useState(false);
  const [amount, setAmount] = useState(String(bill.amount ?? ""));
  const [status, setStatus] = useState(bill.status ?? "unpaid");
  const [billingDate, setBillingDate] = useState(
    bill.billing_date
      ? new Date(bill.billing_date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [usage, setUsage] = useState(String(bill.usage ?? ""));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = Cookies.get("accessToken");

    const payload: Record<string, unknown> = {
      amount: Number(amount),
      status,
      billing_date: billingDate,
    };
    if (usage) payload.usage = Number(usage);

    console.log(`PATCH /billings/${bill.id} payload:`, payload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/billings/${bill.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log(`PATCH /billings/${bill.id} response:`, response.status, result);

      if (response.ok) {
        setIsShowing(false);
        toast.success(result.message || "Tagihan berhasil diperbarui");
        router.refresh();
      } else {
        const errMsg =
          result.message ||
          (Array.isArray(result.errors)
            ? result.errors.join(", ")
            : JSON.stringify(result));
        toast.error(`Gagal: ${errMsg}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isShowing} onOpenChange={setIsShowing}>
      <DialogTrigger asChild>
        <button
          className="p-1.5 rounded-lg transition-colors hover:bg-indigo-50 text-indigo-500 hover:text-indigo-700"
          title="Edit tagihan"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Tagihan</DialogTitle>
            <DialogDescription>
              Perbarui detail tagihan untuk{" "}
              <span className="font-semibold">
                {bill.customer?.name ?? `Pelanggan #${bill.customer_id}`}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4 py-4">
            {/* Amount */}
            <Field>
              <Label htmlFor="edit-amount">Nominal Tagihan (IDR) *</Label>
              <Input
                id="edit-amount"
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 50000"
                required
              />
            </Field>

            {/* Usage */}
            <Field>
              <Label htmlFor="edit-usage">Pemakaian (m³) — opsional</Label>
              <Input
                id="edit-usage"
                type="number"
                min={0}
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="Contoh: 15"
              />
            </Field>

            {/* Status */}
            <Field>
              <Label htmlFor="edit-status">Status Pembayaran *</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Belum Lunas</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="overdue">Terlambat</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Billing date */}
            <Field>
              <Label htmlFor="edit-billing-date">Tanggal Tagihan *</Label>
              <Input
                id="edit-billing-date"
                type="date"
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Memperbarui..." : "Perbarui Tagihan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBill;
