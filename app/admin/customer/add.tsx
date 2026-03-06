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
import type { Services } from "@/types/services";

const AddCustomer = () => {
  const router = useRouter();
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [customerNumber, setCustomerNumber] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetForm = () => {
    setName(""); setCustomerNumber(""); setPhone(""); setAddress("");
    setUsername(""); setPassword(""); setServiceId("");
  };

  useEffect(() => {
    const fetchServices = async () => {
      const token = Cookies.get("accessToken");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`, {
          headers: {
            "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
            Authorization: `Bearer ${token}`,
          },
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY || ""}`,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, customer_number: customerNumber, phone, address, username, password, service_id: parseInt(serviceId) }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsShowing(false); resetForm();
        toast.success(result.message || "Customer added successfully");
        router.refresh();
      } else {
        toast.warning(result.message || "Failed to add customer");
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
        <Button onClick={resetForm} className="bg-indigo-700 hover:bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-900/40">
          Add New Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-indigo-800/50 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Add New Customer</DialogTitle>
            <DialogDescription className="text-indigo-300">Fill in the customer details below to register a new account.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="name" className="text-indigo-200">Full Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required className={inputClass} />
              </Field>
              <Field>
                <Label htmlFor="customerNumber" className="text-indigo-200">Customer Number *</Label>
                <Input id="customerNumber" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} placeholder="e.g. 34545898012332" required className={inputClass} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="phone" className="text-indigo-200">Phone Number *</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 081234567890" required className={inputClass} />
              </Field>
              <Field>
                <Label htmlFor="serviceId" className="text-indigo-200">Service Package *</Label>
                <Select value={serviceId} onValueChange={setServiceId} required>
                  <SelectTrigger className="bg-gray-800 border-indigo-800/60 text-white">
                    <SelectValue placeholder="Select service" />
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
              <Label htmlFor="address" className="text-indigo-200">Address *</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Jl. Merdeka No. 123" required className={inputClass} />
            </Field>
            <div className="border-t border-indigo-800/40 pt-4 mt-4">
              <h4 className="font-medium mb-3 text-indigo-300">Account Credentials</h4>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label htmlFor="username" className="text-indigo-200">Username *</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. johndoe" required className={inputClass} />
                </Field>
                <Field>
                  <Label htmlFor="password" className="text-indigo-200">Password *</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required className={inputClass} />
                </Field>
              </div>
            </div>
          </FieldGroup>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-indigo-700 text-indigo-300 hover:bg-indigo-900/40 bg-transparent">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-indigo-700 hover:bg-indigo-600 text-white border-0">
              {isLoading ? "Saving..." : "Save Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomer;