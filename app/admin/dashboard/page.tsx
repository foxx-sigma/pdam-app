import { getCookie } from "@/lib/server-cookie";
import { AdminProfileContent } from "./admin-profile-content";

export const dynamic = 'force-dynamic';

interface Root {
  success: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalServices: number;
  totalBilling: number;
  totalPayments: number;
  recentCustomers: any[];
  pendingBills: any[];
}

async function getAdminProfile(): Promise<Data | null> {
  try {
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`,
      {
        headers: {
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    const responseData: Root = await response.json();
    if (!response.ok) return null;
    return responseData.data;
  } catch (error) {
    console.error("Fetch admin profile error:", error);
    return null;
  }
}

async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const token = await getCookie("accessToken");

    const headers = {
      "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // ✅ Endpoint yang benar — /bills bukan /billings
    const [customersRes, servicesRes, billsRes, paymentsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?page=1&quantity=5`, { headers, cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`,                    { headers, cache: "no-store" }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bills?page=1&quantity=100`,   { headers, cache: "no-store" }), // ✅ /bills
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments?page=1&quantity=5`,  { headers, cache: "no-store" }),
    ]);

    const customers = await customersRes.json();
    const services  = await servicesRes.json();
    const bills     = await billsRes.json();
    const payments  = await paymentsRes.json();

    return {
      // ✅ Pakai .count dari API karena lebih akurat dari .data.length
      totalCustomers: customers.count ?? customers.data?.length ?? 0,
      totalServices:  services.count  ?? services.data?.length  ?? 0,
      totalBilling:   bills.count     ?? bills.data?.length     ?? 0,
      totalPayments:  payments.count  ?? payments.data?.length  ?? 0,

      // 5 pelanggan terbaru (sudah diambil dengan quantity=5)
      recentCustomers: customers.data ?? [],

      // Tagihan yang belum lunas (belum ada payment atau belum verified)
      pendingBills: (bills.data ?? [])
        .filter((bill: any) => !bill.paid && bill.payments == null)
        .slice(0, 5),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

export default async function Page() {
  let adminData = null;
  let dashboardStats = null;
  let hasError = false;

  try {
    [adminData, dashboardStats] = await Promise.all([
      getAdminProfile(),
      getDashboardStats(),
    ]);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    hasError = true;
  }

  return (
    <AdminProfileContent
      adminData={adminData}
      dashboardStats={dashboardStats}
      error={hasError}
    />
  );
}