import { useState, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useLogout } from "../../api/queries/useAuth";

const Navbar = () => {
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(urlSearch);

  // Sync local state if URL changes (e.g., cleared from the Filter Sidebar)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  if (urlSearch !== prevUrlSearch) {
    setSearchValue(urlSearch);
    setPrevUrlSearch(urlSearch);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchValue.trim();
    if (term) {
      navigate(`/product-list?search=${encodeURIComponent(term)}`);
    } else {
      navigate("/product-list");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md transition-all shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-10">
        
        {/* 1. Left: Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200">
            <span className="text-white font-bold text-lg">Ac</span>
          </div>
          <span className="hidden font-black lg:inline-block text-xl tracking-tight text-zinc-900 uppercase">
            ACME
          </span>
        </div>

        {/* 2. Middle: Search Bar (Desktop Only) */}
        {/* We keep this for desktop as it's a primary navigation pattern */}
        <div className="flex-1 max-w-md px-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 h-10 rounded-full bg-zinc-100 border-none focus-visible:ring-2 focus-visible:ring-zinc-200 transition-all"
            />
          </form>
        </div>

        {/* 3. Right: Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* MOBILE SEARCH ICON REMOVED 
              Users will now use the floating "Filter" button to search 
          */}

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-zinc-100 rounded-full"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5 text-zinc-600" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-zinc-100 bg-zinc-50/50"
              >
                <User className="h-5 w-5 text-zinc-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-xl border-zinc-100">
              <DropdownMenuLabel className="font-bold text-zinc-900">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-50" />
              <DropdownMenuItem className="cursor-pointer rounded-xl focus:bg-zinc-50">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-xl focus:bg-zinc-50">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-xl focus:bg-zinc-50">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-50" />
              <DropdownMenuItem
                onClick={() => logout()}
                disabled={isPending}
                className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-xl"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isPending ? "Logging out..." : "Logout"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);