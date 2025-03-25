// components/AuthGuard.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/serviceReportPdf",
  "/quotePdf",
  "/invoiceDetails", // Ensure this is here
  "/paySlip",
  "/deviceDoc",
  "/account/supplier_ledger",
  "/paymentInvoice",
];

export default function AuthGuard({ children }) {
  // Added missing children prop
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthGuard checking path:", pathname);
    console.log("Is public path?", isPublicPath);

    // Check if the current path is in the public paths list
    const isPublicPath = publicPaths.some((path) => {
      // Remove trailing slashes for comparison
      const normalizedPath = pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;
      const normalizedPublicPath = path.endsWith("/")
        ? path.slice(0, -1)
        : path;

      return (
        normalizedPath === normalizedPublicPath ||
        normalizedPath.startsWith(`${normalizedPublicPath}/`)
      );
    });

    // If it's a public path, render the children without authentication check
    if (isPublicPath) {
      setLoading(false);
      return;
    }

    // Check for authentication
    const authToken = Cookies.get("auth-token");

    if (!authToken) {
      // Redirect to login if not authenticated
      router.push("/login");
    } else {
      // Allow access to the page if authenticated
      setLoading(false);
    }
  }, [pathname, router]);

  // Show loading state or nothing while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the children (page content) once authentication is confirmed
  return <>{children}</>;
}
