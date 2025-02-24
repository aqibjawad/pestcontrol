"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function StaticURL() {
  const pathname = usePathname();

  useEffect(() => {
    // Get the current origin (domain)
    const origin = window.location.origin;

    // Replace current URL with just the origin
    window.history.replaceState(null, "", origin);
  }, [pathname]);

  return null;
}
