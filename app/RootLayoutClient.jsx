"use client";

import { usePathname } from "next/navigation";
import SideMenu from "../components/SideMenu";


export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isInvoicePage = pathname === "/serviceRpoertPdf/";

  const LayoutWithSidebar = ({ children }) => (
    <div className="layout-container">
      <div className="sidebar-container">
        <SideMenu />
      </div>
      <div className="main-content">
        <main className="main-content-child">
          {children}
        </main>
      </div>
    </div>
  );

  const LayoutWithoutSidebar = ({ children }) => (
    <div className="layout-container home-layout">
      <div className="main-content">
        <main className="main-content-child full-width">
          {children}
        </main>
      </div>
    </div>
  );

  if (isHomePage || isInvoicePage) {
    
    return <LayoutWithoutSidebar>{children}</LayoutWithoutSidebar>;
  } else {
    return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
  }
}