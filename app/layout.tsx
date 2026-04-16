import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/contexts/RoleContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "1Ummah SILP - Scholarship Initiative for the Less Privileged",
  description: "School Management Platform for 1Ummah Islamic Organisation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <RoleProvider>
          {children}
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  );
}
