"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Cpu,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  X,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useLanguage } from "./language-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth, useUser } from "@/firebase";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useUser();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("cyber-sphere-theme");
    if (storedTheme === "light") {
      setIsDark(false);
      return;
    }
    if (storedTheme === "dark") {
      setIsDark(true);
      return;
    }
    setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem("cyber-sphere-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/tools", label: t("nav.tools") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/admin", label: t("nav.admin") },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="fixed top-0 z-[100] flex h-16 w-full items-center border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          {pathname !== "/" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-105" />
              <Cpu className="absolute inset-0 m-auto h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Cyber<span className="text-primary">-Sphere</span>
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark((prev) => !prev)}
              className="text-muted-foreground hover:text-primary"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")}>Hindi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src={`https://picsum.photos/seed/${user.uid}/100/100`} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-morphism w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">Specialist</p>
                      <p className="truncate text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-accent focus:text-accent"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Secure Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" className="ml-2 rounded-full px-5 futuristic-glow">
                  <User className="mr-2 h-4 w-4" />
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsDark((prev) => !prev)}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-16 z-[110] flex w-full flex-col gap-6 border-b border-border bg-background/95 p-6 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
              <Button
                variant={language === "hi" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setLanguage("hi")}
              >
                HI
              </Button>
            </div>

            {user ? (
              <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  className="rounded-full futuristic-glow"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
