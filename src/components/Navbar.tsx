"use client";
import Link from "next/link";
import Container from "../components/Container";
import { usePathname } from "next/navigation";

const linkBase = "rounded-xl px-3 py-2 text-sm md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400";

export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/team", label: "Team" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/apply", label: "Apply" },
  ];

  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-black/80 border-b border-white/20">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" aria-label="Cornell Gen AI Home" className="font-semibold tracking-tight text-zinc-200 flex items-center gap-2">
          <img src="/cgaiweb.svg" alt="CGAI Logo" className="h-8 w-auto" />
          Cornell Gen AI
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
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
      </Container>
    </div>
  );
} 