"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import User from "../networkUtil/user";

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const token = User.getAccessToken();

        if (!token) {
          router.replace("/");
        } else {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
