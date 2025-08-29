"use client";

import { Suspense } from "react";

import LoadingStatic from "@/components/Loading/LoadingStatic";
import Toaster from "@/components/Toaster/Toaster";

import { TranslationProvider } from "@/hooks/use-translation";

import { StackManagerInitializer } from "@/lib/stack-manager";

const MainLayout = ({ children }) => {
  return (
    <Suspense fallback={<LoadingStatic />}>
      <TranslationProvider>{children}</TranslationProvider>
      <Toaster />
      <StackManagerInitializer />
    </Suspense>
  );
};

export default MainLayout;
