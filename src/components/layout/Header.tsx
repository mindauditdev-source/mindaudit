"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Servicios", href: "/servicios" },
    { name: "Nosotros", href: "/sobre-nosotros" },
    { name: "Partners", href: "/partners" },
    { name: "Presupuesto", href: "/presupuesto" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-10 w-40">
              <Image
                src="/logo/t-png.png"
                alt="MindAudit Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm tracking-wide transition-all hover:text-[#0f4c81] ${
                    isActive 
                    ? "text-[#0f4c81] font-bold" 
                    : "text-slate-500 font-medium"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Button asChild size="sm" className="ml-4 bg-[#0f4c81] hover:bg-[#0d3d68] rounded-xl font-bold px-6">
              <Link href="/login">Acceso Partner</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu" className="text-[#0f4c81]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <div className="flex flex-col gap-8 pt-10">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative h-8 w-32">
                    <Image
                      src="/logo/t-png.png"
                      alt="MindAudit Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
                <nav className="flex flex-col gap-5">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-lg transition-colors ${
                          isActive 
                          ? "text-[#0f4c81] font-bold" 
                          : "text-slate-500 font-medium"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                  <Button asChild className="mt-6 w-full bg-[#0f4c81] hover:bg-[#0d3d68] h-14 rounded-2xl font-bold text-lg">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Acceso Partner
                    </Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
