import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./Providers";
import { Synchronize } from "./components/Synchronize";
import Header from "./components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "mattax",
  description: "mattax",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-grow p-4 gap-4">
              <main className="w-full md:w-[70%]">{children}</main>
              <aside className="hidden md:block md:w-[30%]">
                <Synchronize />
              </aside>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
