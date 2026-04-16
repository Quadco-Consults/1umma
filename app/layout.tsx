import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/contexts/RoleContext";
import { Toaster } from "@/components/ui/sonner";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <RoleProvider>
          {children}
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  );
}
