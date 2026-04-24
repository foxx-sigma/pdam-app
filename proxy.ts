import { NextRequest, NextResponse } from "next/server";

// ============================================================
// KONFIGURASI ROUTE
// ============================================================

const ADMIN_ROUTES = ["/admin"];
const CUSTOMER_ROUTES = ["/cust"];
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

// ============================================================
// PROXY FUNCTION — wajib export dengan nama "proxy"
// Letakkan file ini di: project-root/proxy.ts
// ============================================================
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ambil token & role dari cookie
  const token = request.cookies.get("accessToken")?.value;
  const role  = request.cookies.get("userRole")?.value;

  // 2. Halaman publik — langsung lewat tanpa cek apapun
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 3. Tidak ada token → redirect ke login
  if (!token) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Halaman admin — hanya ADMIN yang boleh masuk
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminRoute && role !== "ADMIN") {
    if (role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/cust/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 5. Halaman customer — hanya CUSTOMER yang boleh masuk
  const isCustomerRoute = CUSTOMER_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isCustomerRoute && role !== "CUSTOMER") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 6. Semua lolos → lanjutkan
  return NextResponse.next();
}

// ============================================================
// Export default juga sebagai fallback
// Next.js butuh salah satu dari:
// - export function proxy() {}   ← named export
// - export default function() {} ← default export
// ============================================================
export default proxy;