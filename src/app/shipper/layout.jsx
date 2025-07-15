import MainLayout from "@/layout/Shipper/MainLayout/MainLayout";

export const metadata = {
  title: "Muatrans Shipper",
  description: "",
};

export default function ShipperLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
