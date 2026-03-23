import { useState, useEffect, memo, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  onClose?: () => void;
}

interface ExtendedFilterSidebarProps extends FilterSidebarProps {
  selectedGroupIds: number[];
  onGroupChange: (ids: number[]) => void;
  onReset: () => void;
}

const FilterContent = memo(({
  groups,
  isLoading,
  selectedGroupIds,
  handleToggleGroup,
  onReset,
  isMobile,
  onClose,
}: FilterContentProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeSearchTerm = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(activeSearchTerm);

  useEffect(() => {
    setLocalSearch(activeSearchTerm);
  }, [activeSearchTerm]);

  const executeSearch = (term: string) => {
    const newParams = new URLSearchParams(searchParams);
    const cleanedTerm = term.trim();
    if (cleanedTerm) newParams.set("search", cleanedTerm);
    else newParams.delete("search");

    navigate(`?${newParams.toString()}`, { replace: true });

    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executeSearch(localSearch);
  };


  const isSearchActive = activeSearchTerm.length > 0;

  return (
    <div className="space-y-8 pb-10">
      {isMobile && (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">
                  Search Keywords
                </h3>
                {isSearchActive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 text-[8px] text-white font-bold uppercase">
                    <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="relative group">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors cursor-pointer z-10 
                  ${isSearchActive ? "text-zinc-900" : "text-zinc-400"}`}
                onClick={() => executeSearch(localSearch)}
              />
              <Input
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full pl-11 pr-10 h-14 rounded-2xl bg-zinc-50 border-zinc-100 shadow-none transition-all focus-visible:ring-zinc-200
                  ${isSearchActive ? "border-zinc-900 bg-white" : ""}`}
              />
              {localSearch && (localSearch !== activeSearchTerm) && (
                <button
                  onClick={() => setLocalSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-100 text-zinc-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="h-px bg-zinc-100" />
        </>
      )}

    

      <div className="h-px bg-zinc-100" />

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
                <div key={i} className="h-4 w-full bg-zinc-50 animate-pulse rounded" />
              ))
            : groups?.map((group) => (
                <div key={group.ProductGrpId} className="flex items-center space-x-3 group">
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
});

FilterContent.displayName = "FilterContent";

const FilterSidebar = memo(
  ({
    groups,
    tags,
    isLoading,
    selectedGroupIds,
    onGroupChange,
    onReset,
  }: ExtendedFilterSidebarProps) => {
    const [searchParams] = useSearchParams();
    const [isVisible, setIsVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    const activeSearchTerm = searchParams.get("search") || "";

    useEffect(() => {
      const updateScrollDir = () => {
        const scrollY = window.pageYOffset;

        if (Math.abs(scrollY - lastScrollY.current) < 10) {
          ticking.current = false;
          return;
        }

        if (isOpen) {
          setIsVisible(false);
        } else {
          setIsVisible(scrollY < lastScrollY.current || scrollY < 200);
        }
        
        lastScrollY.current = scrollY > 0 ? scrollY : 0;
        ticking.current = false;
      };

      const onScroll = () => {
        if (!ticking.current) {
          window.requestAnimationFrame(updateScrollDir);
          ticking.current = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [isOpen]);

    const handleToggleGroup = useCallback((groupId: number, checked: boolean) => {
      if (checked) onGroupChange([...selectedGroupIds, groupId]);
      else onGroupChange(selectedGroupIds.filter((id) => id !== groupId));
    }, [onGroupChange, selectedGroupIds]);

    const handleSheetClose = useCallback(() => setIsOpen(false), []);
    const handleSheetOpen = useCallback(() => setIsOpen(true), []);

    return (
      <>
        <div className="lg:hidden">
          <div
            className={`fixed right-6 bottom-8 z-[60] transition-all duration-300 ease-out will-change-transform ${
              isOpen || !isVisible 
                ? "opacity-0 translate-y-12 pointer-events-none scale-75" 
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            <Button
              onClick={handleSheetOpen}
              size="icon"
              className="rounded-full h-14 w-14 shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-zinc-900 text-white border-none active:scale-90 transition-transform"
            >
              <SlidersHorizontal className="h-6 w-6" />
              {(selectedGroupIds.length > 0 || activeSearchTerm) && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white border-2 border-white animate-in zoom-in duration-200">
                  {(selectedGroupIds.length + (activeSearchTerm ? 1 : 0))}
                </span>
              )}
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
              side="bottom"
              className="h-[80vh] rounded-t-[40px] overflow-y-auto border-none shadow-2xl px-6 outline-none z-[80] [&>button]:hidden"
            >
              <div className="pt-10">
                <SheetHeader className="flex flex-row items-center justify-between mb-8 space-y-0">
                  <SheetTitle className="text-1xl font-black text-zinc-900 tracking-tighter uppercase">
                    Filter
                  </SheetTitle>
                  <button 
                    onClick={handleSheetClose}
                    className="h-10 w-10 flex items-center justify-center bg-zinc-100 rounded-full text-zinc-900 hover:bg-zinc-200 active:scale-95 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </SheetHeader>
                <FilterContent
                  groups={groups}
                  tags={tags}
                  isLoading={isLoading}
                  selectedGroupIds={selectedGroupIds}
                  handleToggleGroup={handleToggleGroup}
                  onReset={onReset}
                  isMobile={true}
                  onClose={handleSheetClose}
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
  }
);

FilterSidebar.displayName = "FilterSidebar";

export default FilterSidebar;