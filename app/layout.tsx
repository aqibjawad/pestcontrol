"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SideMenu from "../components/SideMenu";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const noLayoutPages = ["/", "/serviceRpoertPdf", "/quotePdf"];
  const pathname = usePathname();
  const isNoLayoutPage = noLayoutPages.includes(pathname);

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
 