import MainLayout from "@/layout/Transporter/MainLayout/MainLayout";

export const metadata = {
  title: "Muatrans Transporter",
  description: "",
};

export default function TransporterLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
