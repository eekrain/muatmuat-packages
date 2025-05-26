import localFont from "next/font/local";
import "./globals.scss";
import MainLayout from "@/layout/MainLayout/MainLayout";

export const metadata = {
  title: 'MuatTrans Shiipper',
  description: 'MuatTrans Shiipper',
};

const Avenir = localFont({
  src: [
    {
      path: "../fonts/AvenirNextLTPro-Bold.otf",
      weight: "700",
      style: "bolder",
    },
    {
      path: "../fonts/AvenirNextLTPro-Demi.otf",
      weight: "600",
      style: "bold",
    },
    {
      path: "../fonts/AvenirNextLTPro-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AvenirNextLTPro-Regular.otf",
      weight: "400",
      style: "lighter",
    },
  ],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${Avenir.className}`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
