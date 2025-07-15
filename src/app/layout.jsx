import localFont from "next/font/local";

import "./globals.scss";

export const metadata = {
  title: "Muatrans Shipper",
  description: "",
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
      <body className={`${Avenir.className} bg-background`}>{children}</body>
    </html>
  );
}
