"use client";

import { FormEvent, useState, useEffect } from "react";
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
import { Plus } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  customer_number: string;
}

const AddBill = () => {
  const router = useRouter();

  const [isShowing, setIsShowing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [billingDate, setBillingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [usage, setUsage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);

  // Fetch customer list when dialog opens
  useEffect(() => {
    if (!isShowing) return;
    const fetchCustomers = async () => {
      setIsFetchingCustomers(true);
      const token = Cookies.get("accessToken");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?page=1&quantity=100`,
          {
            headers: {
              "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        if (res.ok) setCustomers(json.data ?? []);
        else console.warn("Failed to load customers:", json);
      } catch (err) {
        console.error("Error loading customers:", err);
      } finally {
        setIsFetchingCustomers(false);
      }
    };
    fetchCustomers();
  }, [isShowing]);

  const resetForm = () => {
    setCustomerId("");
    setAmount("");
    setStatus("unpaid");
    setBillingDate(new Date().toISOString().slice(0, 10));
    setUsage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
if (!customerId) {
  toast.warning("Pilih pelanggan terlebih dahulu.");
  return;
}
if (!amount || Number(amount) <= 0) {
  toast.warning("Nominal tagihan harus lebih dari 0.");
  return;
}
if (!billingDate) {
  toast.warning("Tanggal tagihan harus diisi.");
  return;
}
setIsLoading(true);
    const token = Cookies.get("accessToken");

    const payload: Record<string, unknown> = {
      customer_id: Number(customerId),
      amount: Number(amount),
      status,
      billing_date: billingDate,
    };
    if (usage && Number(usage) > 0) payload.usage = Number(usage);

    console.log("POST /billings payload:", payload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/billings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("POST /billings response:", response.status, result);

      if (response.ok) {
        setIsShowing(false);
        resetForm();
        toast.success(result.message || "Tagihan berhasil ditambahkan");
        router.refresh();
      } else {
        // Show the actual API error to help debugging
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
        <Button onClick={resetForm} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Tagihan
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Tagihan Baru</DialogTitle>
            <DialogDescription>
              Isi detail tagihan pelanggan PDAM di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4 py-4">
            {/* Customer dropdown */}
            <Field>
              <Label htmlFor="add-customer">Pilih Pelanggan *</Label>
              {isFetchingCustomers ? (
                <p className="text-sm text-muted-foreground py-2">
                  Memuat daftar pelanggan...
                </p>
              ) : (
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger id="add-customer">
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Tidak ada pelanggan
                      </SelectItem>
                    ) : (
                      customers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name} — {c.customer_number}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </Field>

            {/* Amount */}
            <Field>
              <Label htmlFor="add-amount">Nominal Tagihan (IDR) *</Label>
              <Input
                id="add-amount"
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 50000"
                required
              />
            </Field>

            {/* Usage – optional */}
            <Field>
              <Label htmlFor="add-usage">Pemakaian (m³) — opsional</Label>
              <Input
                id="add-usage"
                type="number"
                min={0}
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="Contoh: 15"
              />
            </Field>

            {/* Status */}
            <Field>
              <Label htmlFor="add-status">Status Pembayaran *</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="add-status">
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
              <Label htmlFor="add-billing-date">Tanggal Tagihan *</Label>
              <Input
                id="add-billing-date"
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
            <Button type="submit" disabled={isLoading || isFetchingCustomers}>
              {isLoading ? "Menyimpan..." : "Simpan Tagihan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBill;
