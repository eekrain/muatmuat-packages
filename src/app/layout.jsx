import localFont from "next/font/local";

import MainLayout from "@/layout/MainLayout/MainLayout";

import "./globals.scss";

export const metadata = {
  title: "Muatrans Shipper",
  description: "",
  icons: {
    icon: "https://buyer.muatmuat.com/_resources/themes/muat/image/icon/icon-01.png",
  },
};

const Avenir = localFont({
  src: [
    {
      path: "../fonts/AvenirNextLTPro-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/AvenirNextLTPro-Demi.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/AvenirNextLTPro-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AvenirNextLTPro-Regular.otf",
      weight: "400",
      style: "normal",
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
