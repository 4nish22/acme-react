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
import type { FilterSidebarProps } from "../../types/product";

const FilterSidebar = ({ groups, tags, isLoading }: FilterSidebarProps) => {
  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block sticky top-24 h-fit">
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
        {/* 1. Sort Section */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
            Sort Order
          </h3>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full bg-zinc-50 rounded-xl border-zinc-100 h-11">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-zinc-100" />

        {/* 2. Categories Section (Group) - Fixed Height for ~6 items */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 mb-4">
            Categories
          </h3>
          <div className="max-h-[310px] overflow-y-auto pr-2 custom-scrollbar space-y-3.5">
            {isLoading
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
                      className="rounded border-zinc-300"
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

        <div className="h-px bg-zinc-100" />

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 mb-4">
            Product Tags
          </h3>
          <div className="max-h-[210px] overflow-y-auto pr-2 custom-scrollbar space-y-3.5">
            {isLoading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-zinc-50 animate-pulse rounded"
                  />
                ))
              : tags?.map((tag) => (
                  <div
                    key={tag.ProductGrpId}
                    className="flex items-center space-x-3 group"
                  >
                    <Checkbox
                      id={`tag-${tag.ProductGrpId}`}
                      className="rounded border-zinc-300"
                    />
                    <Label
                      htmlFor={`tag-${tag.ProductGrpId}`}
                      className="text-[13px] font-bold text-zinc-600 cursor-pointer group-hover:text-zinc-900 transition-colors"
                    >
                      {tag.ProductGrpDesc}
                    </Label>
                  </div>
                ))}
          </div>
        </div>

        {/* 4. Reset Button */}
        <Button
          variant="ghost"
          className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500"
        >
          Reset All Filters
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
