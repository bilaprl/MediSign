// src/app/layout.js
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastContainer from "@/components/features/ToastContainer";
import { ToastProvider } from "@/hooks/useToast";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "MediSign - Digital Medical Prescription",
  description:
    "Stateless digital signature platform for medical prescriptions.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} min-h-screen flex flex-col`}>
        <ToastProvider>
          <Navbar />
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
