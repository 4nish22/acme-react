import { useState, useEffect, memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { SlidersHorizontal, Search, X } from "lucide-react";
import type { FilterSidebarProps } from "../../types/product";

interface FilterContentProps extends FilterSidebarProps {
  selectedGroupIds: number[];
  handleToggleGroup: (groupId: number, checked: boolean) => void;
  onReset: () => void;
  isMobile?: boolean;
}

interface ExtendedFilterSidebarProps extends FilterSidebarProps {
  selectedGroupIds: number[];
  onGroupChange: (ids: number[]) => void;
  onReset: () => void;
}

const FilterContent = ({
  groups,
  isLoading,
  selectedGroupIds,
  handleToggleGroup,
  onReset,
  isMobile,
}: FilterContentProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get active search from URL to check against local state
  const activeSearchTerm = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(activeSearchTerm);

  // Synchronize local search if URL changes (e.g., on Reset)
  useEffect(() => {
    setLocalSearch(activeSearchTerm);
  }, [activeSearchTerm]);

  const executeSearch = (term: string) => {
    const newParams = new URLSearchParams(searchParams);
    const cleanedTerm = term.trim();
    if (cleanedTerm) newParams.set("search", cleanedTerm);
    else newParams.delete("search");
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executeSearch(localSearch);
  };

  const clearSearch = () => {
    setLocalSearch("");
    executeSearch("");
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  // Indicator Logic: Is the search actually applied to the results?
  const isSearchActive = activeSearchTerm.length > 0;

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Keyword Search */}
      {isMobile && (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">
                  Search Keywords
                </h3>
                {/* ACTIVE SEARCH INDICATOR BADGE */}
                {isSearchActive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 text-[8px] text-white font-bold uppercase animate-in fade-in zoom-in duration-300">
                    <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                )}
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">
                {localSearch !== activeSearchTerm
                  ? "Enter to apply"
                  : "Press Enter"}
              </span>
            </div>

            <div className="relative group">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors cursor-pointer 
                  ${isSearchActive ? "text-zinc-900" : "text-zinc-400"}`}
                onClick={() => executeSearch(localSearch)}
              />
              <Input
                placeholder="Search by name..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full pl-10 pr-10 h-12 rounded-xl bg-zinc-50 border-zinc-100 shadow-none transition-all focus-visible:ring-zinc-200
                  ${isSearchActive ? "border-zinc-900 bg-white ring-1 ring-zinc-900/5" : ""}`}
              />
              {localSearch && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* SUBTLE STATUS TEXT */}
            {isSearchActive && (
              <p className="mt-2 text-[11px] text-zinc-500 font-medium">
                Filtering by:{" "}
                <span className="text-zinc-900 font-bold">
                  "{activeSearchTerm}"
                </span>
              </p>
            )}
          </div>
          <div className="h-px bg-zinc-100" />
        </>
      )}

      {/* 2. Sort Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
          Sort Order
        </h3>
        <Select
          defaultValue={searchParams.get("sort") || "newest"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full bg-zinc-50 rounded-xl border-zinc-100 h-11 focus:ring-0 text-[13px] font-medium shadow-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl border-zinc-100">
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-zinc-100" />

      {/* 3. Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">
            Categories
          </h3>
          {selectedGroupIds.length > 0 && (
            <span className="text-[10px] font-black text-zinc-900">
              {selectedGroupIds.length} Selected
            </span>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3.5">
          {isLoading && !groups?.length
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-zinc-50 animate-pulse rounded"
                />
              ))
            : groups?.map((group) => (
                <div
                  key={group.ProductGrpId}
                  className="flex items-center space-x-3 group"
                >
                  <Checkbox
                    id={`group-${group.ProductGrpId}`}
                    className="rounded border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900"
                    checked={selectedGroupIds.includes(group.ProductGrpId)}
                    onCheckedChange={(checked) =>
                      handleToggleGroup(group.ProductGrpId, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`group-${group.ProductGrpId}`}
                    className="text-[13px] font-bold text-zinc-600 cursor-pointer group-hover:text-zinc-900 transition-colors"
                  >
                    {group.ProductGrpDesc}
                  </Label>
                </div>
              ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          variant="ghost"
          onClick={() => {
            setLocalSearch("");
            onReset();
          }}
          className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

const FilterSidebar = memo(
  ({
    groups,
    tags,
    isLoading,
    selectedGroupIds,
    onGroupChange,
    onReset,
  }: ExtendedFilterSidebarProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      const controlButton = () => {
        if (isOpen) return;
        if (window.scrollY > lastScrollY && window.scrollY > 200)
          setIsVisible(false);
        else setIsVisible(true);
        setLastScrollY(window.scrollY);
      };
      window.addEventListener("scroll", controlButton);
      return () => window.removeEventListener("scroll", controlButton);
    }, [lastScrollY, isOpen]);

    const handleToggleGroup = (groupId: number, checked: boolean) => {
      if (checked) onGroupChange([...selectedGroupIds, groupId]);
      else onGroupChange(selectedGroupIds.filter((id) => id !== groupId));
    };

    return (
      <>
        <div className="lg:hidden">
          <div
            className={`fixed left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
              isOpen ? "bottom-[82vh] z-[100]" : "bottom-8 z-[60]"
            } ${!isVisible && !isOpen ? "opacity-0 translate-y-10 pointer-events-none" : "opacity-100 translate-y-0"}`}
          >
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className={`rounded-full h-14 px-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 ${
                isOpen
                  ? "bg-white text-zinc-900 border border-zinc-200 scale-90"
                  : "bg-zinc-900 text-white border-none"
              }`}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <SlidersHorizontal className="h-5 w-5" />
              )}
              <span className="font-bold text-sm uppercase tracking-widest ml-2">
                {isOpen ? "Close" : "Filter"}
              </span>

              {!isOpen && selectedGroupIds.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-zinc-900 text-[10px] font-black ml-1">
                  {selectedGroupIds.length}
                </span>
              )}
            </Button>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
              side="bottom"
              // Added [&>button]:hidden to hide the default close icon
              className="h-[80vh] rounded-t-[40px] overflow-y-auto border-none shadow-2xl px-6 outline-none z-[80] [&>button]:hidden"
            >
              <div className="pt-10">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">
                    Filter & Search
                  </SheetTitle>
                </SheetHeader>
                <FilterContent
                  groups={groups}
                  tags={tags}
                  isLoading={isLoading}
                  selectedGroupIds={selectedGroupIds}
                  handleToggleGroup={handleToggleGroup}
                  onReset={onReset}
                  isMobile={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <aside className="w-72 flex-shrink-0 hidden lg:block sticky top-24 h-fit">
          <div className="bg-white rounded-[32px] border border-zinc-100 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.02)]">
            <FilterContent
              groups={groups}
              tags={tags}
              isLoading={isLoading}
              selectedGroupIds={selectedGroupIds}
              handleToggleGroup={handleToggleGroup}
              onReset={onReset}
              isMobile={false}
            />
          </div>
        </aside>
      </>
    );
  },
);

FilterSidebar.displayName = "FilterSidebar";

export default FilterSidebar;
