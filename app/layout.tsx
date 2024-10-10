"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import SideMenu from "../components/SideMenu";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const noLayoutPages = [
    "/serviceReportPdf",
    "/quotePdf",
    "/account/supplier_ledger",
    "/invoiceDetails",
  ];
  const pathname = usePathname();

  // Extract just the pathname, excluding the query string part
  const cleanedPathname = pathname.split("?")[0];

  // Check if the cleaned pathname starts with any of the noLayoutPages
  const isNoLayoutPage = noLayoutPages.some(page => cleanedPathname.startsWith(page));

  return (
    <html lang="en">
      <body className={inter.className}>
        {isNoLayoutPage ? (
          <div className="">{children}</div>
        ) : (
          <SideMenu>{children}</SideMenu>
        )}
      </body>
    </html>
  );
}