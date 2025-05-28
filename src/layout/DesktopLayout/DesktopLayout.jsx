import { usePathname } from "next/navigation";

import HeaderWeb from "@/components/Header/Web/HeaderWeb";

export default function DesktopLayout({ children }) {
  const pathname = usePathname();
  const arr = ["/register/otp"];
  if (arr.some((item) => pathname.includes(item))) {
    return children;
  }
  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderWeb />
      <main className="pt-[62px]">{children}</main>
    </div>
  );
}
