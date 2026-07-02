"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import content from "@/lib/content";

function NavLink({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm transition-colors hover:text-foreground ${
        isActive ? "text-foreground font-medium" : "text-muted"
      }`}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-3 right-3 h-px bg-foreground rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function Header() {
  const navItems = [
    { href: "/", label: content.nav.home },
    { href: "/projects", label: content.nav.projects },
    { href: "/about", label: content.nav.about },
    { href: "/roadmap", label: content.nav.roadmap },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="Casper Schepkens"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="hidden font-display text-lg sm:inline">Casper Schepkens</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </div>
    </header>
  );
}
