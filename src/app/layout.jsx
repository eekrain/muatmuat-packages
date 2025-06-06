import localFont from "next/font/local";

import MainLayout from "@/layout/MainLayout/MainLayout";

import "./globals.scss";

export const metadata = {
  title: "MuatTrans Shipper",
  description: "MuatTrans Shipper",
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
      <body className={`${Avenir.className} bg-background`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
