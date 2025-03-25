"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import SideMenu from "../components/SideMenu";
import AuthGuard from "../components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const cleanedPathname = pathname.split("?")[0];

  const noLayoutPages = [
    "/serviceReportPdf", // Fixed typo
    "/quotePdf",
    "/invoiceDetails",
    "/paySlip",
    "/deviceDoc",
  ];

  // Check if current path is in noLayoutPages (without needing trailing slashes)
  const isNoLayoutPage = noLayoutPages.some(path => 
    cleanedPathname === path || cleanedPathname.startsWith(`${path}/`)
  );
  
  const isRootPath = cleanedPathname === "/" || cleanedPathname.startsWith("/?");

  return (
    <html lang="en">
      <body className={inter.className}>
        {isNoLayoutPage || isRootPath ? (
          // No auth check for these pages
          <div className="">{children}</div>
        ) : (
          // Auth check for all other pages
          <AuthGuard>
            <SideMenu>{children}</SideMenu>
          </AuthGuard>
        )}
      </body>
    </html>
  );
}