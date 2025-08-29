import MainLayout from "./components/MainLayout";
import "./globals.scss";

export const metadata = {
  title: "Muatrans Shipper",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background font-sans antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
