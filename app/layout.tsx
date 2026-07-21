import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import NotificationsProvider from "./NotificationsProvider";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import ThemeProvider from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "GrouPay - Collaborative finance for all",
  description: "GrouPay Homepage",
  manifest: "/manifest.json",
  themeColor: "#0d2b1f",
  appleWebApp: {
    capable: true,
    title: "GrouPay",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icon-192.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="GrouPay" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className={`min-h-full grid ${inter.className}`}>
        <ThemeProvider>
          <QueryProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </QueryProvider>
        </ThemeProvider>
        <div id="modal-portal" />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
