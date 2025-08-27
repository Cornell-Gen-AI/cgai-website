"use client";
import Link from "next/link";
import Container from "../components/Container";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const linkBase = "rounded-xl px-3 py-2 text-sm md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/team", label: "Team" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/apply", label: "Apply" },
  ];

  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-black/80 border-b border-white/20">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" aria-label="Generative AI @ Cornell Home" className="font-semibold tracking-tight text-zinc-200 flex items-center gap-2 text-base md:text-lg">
          <img src="/cgaiweb.svg" alt="CGAI Logo" className="h-6 md:h-8 w-auto" />
          <span className="hidden sm:inline">Generative AI @ Cornell</span>
          <span className="sm:hidden">CGAI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  linkBase,
                  isActive ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-black/95 backdrop-blur">
          <Container className="py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={[
                      "rounded-xl px-4 py-3 text-base transition-colors",
                      isActive 
                        ? "bg-white/10 text-white" 
                        : "text-zinc-300 hover:text-white hover:bg-white/10"
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </div>
  );
} 