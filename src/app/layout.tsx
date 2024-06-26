import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Header from "./_components/header/header";
import { AuthProvider } from "@/context/authContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TurnoverBiz Authflow",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <AuthProvider>
          <TRPCReactProvider>
            <Header />
            <main className="container mx-auto max-w-[600px] rounded-2xl border border-2 p-8 px-12 text-center md:w-2/3">
              {children}
            </main>
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
