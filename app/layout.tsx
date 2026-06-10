import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "GrouPay - Collaborative finance for all",
  description: "GrouPay Homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className={`min-h-full grid ${inter.className}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
