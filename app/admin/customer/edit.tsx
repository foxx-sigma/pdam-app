"use client";

import { FormEvent, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import type { Customer } from "@/types/customer";
import type { Services } from "@/types/services";

interface EditCustomerProps { customer: Customer; }

const EditCustomer = ({ customer }: EditCustomerProps) => {
  const router = useRouter();
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [name, setName] = useState<string>(customer.name);
  const [customerNumber, setCustomerNumber] = useState<string>(customer.customer_number);
  const [phone, setPhone] = useState<string>(customer.phone);
  const [address, setAddress] = useState<string>(customer.address);
  const [serviceId, setServiceId] = useState<string>(customer.service_id.toString());
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchServices = async () => {
      const token = Cookies.get("accessToken");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`, {
          headers: { "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`, Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (response.ok) setServices(result.data);
      } catch (error) { console.error("Error fetching services:", error); }
    };
    if (isShowing) fetchServices();
  }, [isShowing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = Cookies.get("accessToken");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`, Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, customer_number: customerNumber, phone, address, service_id: parseInt(serviceId) }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsShowing(false);
        toast.success(result.message || "Customer updated successfully");
        router.refresh();
      } else {
        toast.warning(result.message || "Failed to update customer");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "bg-gray-800 border-indigo-800/60 text-white placeholder:text-gray-500 focus-visible:border-indigo-500";

  return (
    <Dialog open={isShowing} onOpenChange={setIsShowing}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/40 bg-transparent">
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-indigo-800/50 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit Customer</DialogTitle>
            <DialogDescription className="text-indigo-300">Update customer information below.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="edit-name" className="text-indigo-200">Full Name *</Label>
                <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
              </Field>
              <Field>
                <Label htmlFor="edit-customerNumber" className="text-indigo-200">Customer Number *</Label>
                <Input id="edit-customerNumber" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} required className={inputClass} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="edit-phone" className="text-indigo-200">Phone Number *</Label>
                <Input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
              </Field>
              <Field>
                <Label htmlFor="edit-serviceId" className="text-indigo-200">Service Package *</Label>
                <Select value={serviceId} onValueChange={setServiceId} required>
                  <SelectTrigger className="bg-gray-800 border-indigo-800/60 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-indigo-800/60 text-white">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()} className="focus:bg-indigo-800/40 focus:text-white">
                        {service.name} ({service.min_usage}-{service.max_usage} m³)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <Label htmlFor="edit-address" className="text-indigo-200">Address *</Label>
              <Input id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} required className={inputClass} />
            </Field>
          </FieldGroup>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-indigo-700 text-indigo-300 hover:bg-indigo-900/40 bg-transparent">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-indigo-700 hover:bg-indigo-600 text-white border-0">
              {isLoading ? "Updating..." : "Update Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomer;