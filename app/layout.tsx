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
    "/serviceRpoertPdf/",
    "/quotePdf/",
    // "/account/supplier_ledger/",
    "/invoiceDetails/",
    "/paySlip/",
    "/deviceDoc/",
    "/paymentInvoice/",
  ];
  const pathname = usePathname();

  const cleanedPathname = pathname.split("?")[0];

  const isRootPath =
    cleanedPathname === "/" || cleanedPathname.startsWith("/?");

  const isNoLayoutPage = noLayoutPages.includes(cleanedPathname) || isRootPath;

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
