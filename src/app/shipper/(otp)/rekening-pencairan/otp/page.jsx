"use client";

import RequestOtpResponsive from "@/container/Shipper/RequestOtp/Responsive/RequestOtpResponsive";
import RequestOtpWeb from "@/container/Shipper/RequestOtp/Web/RequestOtpWeb";
import useDevice from "@/hooks/use-device";

export default function Page() {
  const { isMobile, mounted } = useDevice();
  if (!mounted) return null;
  if (isMobile) {
    return <RequestOtpResponsive />;
  }
  return <RequestOtpWeb />;
}
