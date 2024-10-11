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
    "/quotePdf/",
    "/account/supplier_ledger",
  ];
  const pathname = usePathname();

  // Extract just the pathname, excluding the query string part
  const cleanedPathname = pathname.split("?")[0];

  // Check if the cleaned pathname is "/" or starts with "/"
  const isRootPath =
    cleanedPathname === "/" || cleanedPathname.startsWith("/?");

  // Check if the cleaned pathname is in the noLayoutPages array or is a root path
  const isNoLayoutPage = noLayoutPages.includes(cleanedPathname) || isRootPath;

  // console.log("Current Pathname:", pathname);
  // console.log("Cleaned Pathname:", cleanedPathname);
  // console.log("Is No Layout Page:", noLayoutPages.includes(cleanedPathname))

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