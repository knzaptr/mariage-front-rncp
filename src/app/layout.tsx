import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lisy & Lilian",
  description: "Weeding website for Lisy and Lilian",
  icons: {
    icon: "/logo-nD3SZYrT.jpeg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 antialiased">
        <div className="mx-auto pt-8 flex flex-col justify-between">
          <LanguageProvider>
            <Header />
            <main className="mt-8 min-h-[80vh]">{children}</main>
            <Footer />
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
