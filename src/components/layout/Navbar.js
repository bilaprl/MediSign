// src/components/layout/Navbar.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mencegah scroll body saat sidebar terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Area Dokter", href: "/doctor/login", pathMatch: "/doctor" },
    {
      name: "Area Apoteker",
      href: "/pharmacist/portal",
      pathMatch: "/pharmacist",
    },
    {
      name: "Tentang Sistem",
      href: "/pelajari-sistem",
      pathMatch: "/pelajari-sistem",
    },
  ];

  return (
    <>
      <nav className="bg-white sticky top-0 z-40 shadow-sm relative">
        {/* Border Gradient Biru ke Hijau di bagian bawah navbar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-success-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/assets/logo.png"
                  alt="MediSign Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight">
                Medi
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-success-500">
                  Sign
                </span>
              </span>
            </Link>

            {/* Desktop Menu - Pill Model Container */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center gap-1 p-1.5 bg-slate-50 border border-slate-200/80 rounded-full shadow-inner">
                {navLinks.map((link) => {
                  const isActive = pathname.includes(link.pathMatch);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-primary-600 to-success-500 text-white shadow-md"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -mr-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors focus:outline-none"
                aria-label="Buka menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/assets/logo.png"
                alt="MediSign Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg text-slate-900">Menu Utama</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors focus:outline-none"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname.includes(link.pathMatch);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-success-50 text-primary-700 border border-primary-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Dekorasi bawah sidebar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary-600 to-success-500"></div>
      </div>
    </>
  );
}
