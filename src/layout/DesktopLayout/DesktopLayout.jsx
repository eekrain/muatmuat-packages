import { usePathname } from "next/navigation";

import FloatingButton from "@/components/FloatingButton/FloatingButton";
import HeaderWeb from "@/components/Header/Web/HeaderWeb";

export default function DesktopLayout({ children }) {
  const pathname = usePathname();
  const arr = ["/register/otp"];
  if (arr.some((item) => pathname.includes(item))) {
    return children;
  }
  return (
    <div className="min-h-screen bg-background">
      <HeaderWeb />
      <div className="pt-8">{children}</div>
      <FloatingButton />
    </div>
  );
}
