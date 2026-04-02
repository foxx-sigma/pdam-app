export interface BillCustomer {
  id: number;
  name: string;
  customer_number: string;
  phone: string;
  address: string;
}

export interface Bill {
  id: number;
  customer_id: number;
  amount: number;
  status: string; // e.g. "paid", "unpaid", "pending"
  billing_date: string;
  due_date?: string;
  paid_date?: string;
  month?: number;
  year?: number;
  usage?: number;
  owner_token?: string;
  createdAt: string;
  updatedAt: string;
  customer: BillCustomer;
}
