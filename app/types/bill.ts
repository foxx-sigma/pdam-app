export interface BillCustomer {
  id: number;
  name: string;
  customer_number: string;
  phone: string;
  address: string;
}

export interface Bill {
  status: string;
  id: number;
  customer_id: number;
  admin_id?: number;
  month?: number;
  year?: number;
  measurement_number?: string;
  usage_value?: number;
  price?: number;
  service_id?: number;
  paid: boolean;           // ← field yang benar
  amount: number;
  billing_date?: string;
  owner_token?: string;
  createdAt: string;
  updatedAt: string;
  customer: BillCustomer;
  payments?: unknown;
}