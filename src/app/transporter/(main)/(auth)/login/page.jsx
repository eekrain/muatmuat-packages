"use client";

import { useRouter } from "next/navigation";
import React from "react";

import LoginPage from "@/container/Transporter/Auth/Login/LoginPage";

import { useAuth } from "@/hooks/use-auth";

function Page() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  console.log("isAuthenticated:", isLoggedIn);

  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return null;
  }

  return <LoginPage />;
}

export default Page;
