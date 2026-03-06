'use client';
import { useState, useEffect } from "react";
import type { Customer } from "@/types/customer";
import AddCustomer from "./add";
import EditCustomer from "./edit";
import DeleteCustomer from "./delete";
import { ResetPassword } from "./reset-password";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Phone, MapPin, RefreshCw } from "lucide-react";
import Search from "@/components/Search";
import SimplePagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";

type ResultData = {
  success: boolean;
  message: string;
  data: Customer[];
  count: number;
};

type Props = {
  searchParams: Promise<{
    page?: number;
    quantity?: number;
    search?: string;
  }>;
};

async function getCustomers(search: string = "", page: number = 1, quantity: number = 10): Promise<{data: Customer[], count: number}> {
  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?search=${search}&page=${page}&quantity=${quantity}`,
      {
        headers: {
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY ?? "",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result: ResultData = await response.json();
    if (!response.ok) return { data: [], count: 0 };

    return { data: result.data, count: result.count };
  } catch (error) {
    console.error("Fetch customers error:", error);
    return { data: [], count: 0 };
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatPhone(phone: string): string {
  if (phone.length >= 10) {
    return phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
  }
  return phone;
}

export default function CustomerPage({ searchParams }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resetPasswordCustomer, setResetPasswordCustomer] = useState<Customer | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuantity, setCurrentQuantity] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await searchParams;
      const page = resolvedParams?.page || 1;
      const quantity = resolvedParams?.quantity || 10;
      const search = resolvedParams?.search || "";

      setCurrentPage(Number(page));
      setCurrentQuantity(Number(quantity));
      setCurrentSearch(search);

      setLoading(true);
      const result = await getCustomers(search, Number(page), Number(quantity));
      setCustomers(result.data);
      setCount(result.count);
      setLoading(false);
    };

    fetchData();
  }, [searchParams]);

  const totalCustomers = count;
  const activeCustomers = count;
  const totalServices = new Set(customers.map((c) => c.service_id)).size;

  const handleResetPasswordSuccess = () => {
    const fetchData = async () => {
      const result = await getCustomers(currentSearch, currentPage, currentQuantity);
      setCustomers(result.data);
    };
    fetchData();
  };

  const statCards = [
    {
      title: "Total Customers", value: totalCustomers, sub: "Registered users",
      icon: <Users className="h-5 w-5 text-indigo-300" />,
      bg: "bg-indigo-900"
    },
    {
      title: "Active Customers", value: activeCustomers, sub: "Active accounts",
      icon: <UserCheck className="h-5 w-5 text-blue-300" />,
      bg: "bg-blue-900"
    },
    {
      title: "Services Used", value: totalServices, sub: "Different packages",
      icon: <MapPin className="h-5 w-5 text-violet-300" />,
      bg: "bg-violet-900"
    },
    {
      title: "Total Contacts", value: count, sub: "Phone numbers",
      icon: <Phone className="h-5 w-5 text-sky-300" />,
      bg: "bg-sky-900"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Customer Management</h1>
            <p className="text-indigo-400 mt-1">Manage your PDAM customer database</p>
          </div>
          <AddCustomer />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <Card key={i} className={`border border-indigo-800/50 shadow-xl shadow-indigo-950/50 text-white ${card.bg}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{card.value}</div>
              <p className="text-xs text-indigo-300 mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-xl shadow-indigo-950/40 border border-indigo-800/40 bg-gray-900">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-white">Customer Database</CardTitle>
              <CardDescription className="text-indigo-400">
                Complete list of all registered PDAM customers
                {currentSearch && (
                  <span className="ml-2 text-indigo-300 font-medium">
                    — showing results for &quot;{currentSearch}&quot; ({count} found)
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <Search
                search={currentSearch}
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-800 border border-indigo-800/60 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-indigo-400">Loading...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-indigo-600" />
              <h3 className="mt-4 text-lg font-medium text-white">
                {currentSearch ? `No customers found for "${currentSearch}"` : "No customers found"}
              </h3>
              <p className="mt-2 text-sm text-indigo-400">
                {currentSearch ? "Try a different search term." : "Get started by adding a new customer."}
              </p>
              {!currentSearch && <div className="mt-6"><AddCustomer /></div>}
            </div>
          ) : (
            <div className="rounded-xl border border-indigo-800/40 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-indigo-800/40 hover:bg-transparent" style={{ background: 'rgba(30,58,138,0.3)' }}>
                    {["No","Customer Info","Customer Number","Username","Contact","Address","Service Package","Service Price","Status","Actions"].map(h => (
                      <TableHead key={h} className={`font-semibold text-indigo-300 ${["Service Price"].includes(h) ? "text-right" : ["Status","Actions"].includes(h) ? "text-center" : ""}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer, index) => (
                    <TableRow key={customer.id} className="border-indigo-800/30 hover:bg-indigo-900/20 transition-colors">
                      <TableCell className="font-medium text-gray-300">
                        {(currentPage - 1) * currentQuantity + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md"
                            >
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white">{customer.name}</div>
                            <div className="text-xs text-indigo-400">ID: {customer.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-800 border border-indigo-800/40 px-2 py-1 rounded text-indigo-300">{customer.customer_number}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs border-indigo-700/60 text-indigo-300 bg-indigo-900/30">{customer.user.username}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Phone className="h-3 w-3 text-indigo-400" />
                          <span>{formatPhone(customer.phone)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1 text-sm max-w-[200px] text-gray-300">
                          <MapPin className="h-3 w-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{customer.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-white">{customer.service.name}</div>
                          <div className="text-xs text-indigo-400">{customer.service.min_usage} - {customer.service.max_usage} m³</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-400">
                        {formatCurrency(customer.service.price)}
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.user.role === "CUSTOMER" ? (
                          <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-800 text-gray-400 border border-gray-700">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <EditCustomer customer={customer} />
                          <Button variant="outline" size="sm" onClick={() => setResetPasswordCustomer(customer)}
                            className="h-8 w-8 p-0 border-indigo-700/60 text-indigo-300 hover:bg-indigo-900/40 bg-transparent">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <DeleteCustomer customerId={customer.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {count > 0 && (
        <>
          <Card className="mt-6 border border-indigo-800/40 bg-gray-900 shadow-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-indigo-400 font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-white mt-1">{count}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-400 font-medium">Active Accounts</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{count}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-400 font-medium">Services in Use</p>
                  <p className="text-2xl font-bold text-indigo-300 mt-1">{totalServices}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center">
            <SimplePagination currentPage={currentPage} count={count} perPage={currentQuantity} />
          </div>
        </>
      )}

      {resetPasswordCustomer && (
        <ResetPassword
          customerId={resetPasswordCustomer.id}
          customerName={resetPasswordCustomer.name}
          onClose={() => setResetPasswordCustomer(null)}
          onSuccess={handleResetPasswordSuccess}
        />
      )}
    </div>
  );
}