import React from "react";
import {
  Search,
  ShoppingCart,
  LogOut,
  User,
  Settings,
  CreditCard,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md dark:bg-background/80 transition-all shadow-sm">
      {" "}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 1. Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-xl">
              Ac
            </span>
          </div>
          <span className="hidden font-bold lg:inline-block text-xl tracking-tight">
            ACME
          </span>
        </div>

        {/* 2. Middle: Search Bar */}
        <div className="flex-1 max-w-md px-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 h-10 rounded-full bg-secondary/50 border-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* 3. Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Cart with Badge */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-secondary rounded-full"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              3
            </span>
          </Button>

          {/* User Profile & Logout Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border bg-secondary/30"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
