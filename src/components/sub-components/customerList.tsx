import { useState, useEffect } from "react"; // Added useEffect
import { useCustomers } from "../../api/queries/useCustomer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Hash,
  MapPin,
  Loader2,
} from "lucide-react";
import type { Customer } from "../../types/customer";

interface CustomerDrawerProps {
  onSelect: (customer: Customer) => void;
}

const CustomerDrawer = ({ onSelect }: CustomerDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const take = 20;

  // 1. Separate state for the raw input and the debounced search key
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 2. Effect to handle the debounce timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0); // Reset page only when the debounced value changes
    }, 400); // 400ms delay is usually the sweet spot for search

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. The hook now listens to 'debouncedSearch' instead of 'searchTerm'
  const { data, isLoading } = useCustomers({
    "Context.GlCategory": "both,customer",
    SearchKey: debouncedSearch || null,
    Skip: page * take,
    Take: take,
  });

  const scrollToTop = () => {
    const container = document.getElementById("customer-list-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-12 px-6 rounded-2xl border-zinc-200 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all gap-2"
        >
          <User size={14} /> Find Customer
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-[#F8F8F7] p-0 flex flex-col border-l border-zinc-200"
      >
        <SheetHeader className="p-8 bg-white border-b border-zinc-100">
          <SheetTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-4">
            Registry / Customer Lookup
          </SheetTitle>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} strokeWidth={3} />
              ) : (
                <Search size={16} />
              )}
            </div>
            <Input
              placeholder="Search by name, PAN, or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-zinc-50 border-none rounded-2xl text-[13px] font-medium focus-visible:ring-1 focus-visible:ring-zinc-200"
            />
          </div>
        </SheetHeader>

        <div 
          id="customer-list-container" 
          className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar"
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center opacity-50">
              <Loader2 className="animate-spin text-zinc-900" size={24} strokeWidth={1} />
            </div>
          ) : data?.customers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 uppercase text-[10px] font-bold tracking-widest">
              No Records Found
            </div>
          ) : (
            data?.customers.map((customer) => (
              <button
                key={customer.LedgerId}
                onClick={() => handleSelect(customer)}
                className="w-full text-left bg-white p-5 rounded-[24px] border border-white hover:border-zinc-200 hover:shadow-md transition-all group flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-[12px] font-black uppercase tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {customer.GlPrintingName}
                  </h4>
                  <span className="text-[9px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">
                    {customer.GlShortName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                    <Hash size={12} className="text-zinc-300" />
                    PAN: {customer.PanNo || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                    <MapPin size={12} className="text-zinc-300" />
                    {customer.AreaDesc}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Page {page + 1} of{" "}
            {Math.max(1, Math.ceil((data?.totalRecords || 0) / take))}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-10 w-10 shadow-none border-zinc-200"
              disabled={page === 0 || isLoading}
              onClick={() => {
                setPage((p) => p - 1);
                scrollToTop();
              }}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-10 w-10 shadow-none border-zinc-200"
              disabled={(page + 1) * take >= (data?.totalRecords || 0) || isLoading}
              onClick={() => {
                setPage((p) => p + 1);
                scrollToTop();
              }}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerDrawer;