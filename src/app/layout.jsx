import localFont from "next/font/local";

import "./globals.scss";

export const metadata = {
  title: "Muatrans Shipper",
  description: "",
};

const Avenir = localFont({
  variable: "--font-avenir",
  display: "swap",
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
    <html lang="en" className={Avenir.variable}>
      <body className="bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
