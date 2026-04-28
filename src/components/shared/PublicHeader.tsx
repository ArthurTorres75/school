"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { SITE_COPY } from "@/lib/site-copy";
import { UI_COPY } from "@/lib/ui-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = SITE_COPY[language];
  const uiCopy = UI_COPY[language];
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: copy.publicNav.home },
    { href: "/cursos", label: copy.publicNav.courses },
    { href: "/noticias", label: copy.publicNav.news },
    { href: "/contacto", label: copy.publicNav.contact },
    { href: "/auth", label: copy.publicNav.admissions },
  ];

  return (
    <header className="rounded-3xl border border-primary/15 bg-card/85 px-4 py-4 shadow-lg shadow-primary/8 backdrop-blur sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="outline" className="rounded-full border-primary/20 bg-primary/8 text-primary hover:bg-primary/12">
          <Link href="/">{copy.brandLabel}</Link>
        </Button>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button asChild variant="outline" size="sm" className="rounded-full border-primary/20 bg-primary/8 text-primary hover:bg-primary/12">
            <Link href="/login">{uiCopy.auth.loginAction}</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
      </div>

      <NavigationMenu
        aria-label="Navegación principal"
        className={cn("mt-3 w-full", isOpen ? "block" : "hidden md:block")}
      >
        <NavigationMenuList className="w-full flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-center">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "justify-start md:justify-center",
                    isActive
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-border bg-background/70 text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
                  )}
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
