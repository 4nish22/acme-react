import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';

const FilterSidebar = () => {
  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block sticky top-24 h-fit">
      {/* The White Card Container */}
      <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
        
        {/* Sort By Section */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 mb-4">
            Sort Order
          </h3>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full bg-secondary/30 rounded-xl border-none h-11 focus:ring-1 focus:ring-primary/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-border/40" /> {/* Subtle Divider */}

        {/* Categories Section */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 mb-4">
            Categories
          </h3>
          <div className="space-y-3">
            {['Memory', 'Storage', 'GPU', 'CPU', 'Power Supply'].map((cat) => (
              <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
                <Checkbox 
                  id={cat} 
                  className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                />
                <Label 
                  htmlFor={cat} 
                  className="text-sm font-medium text-foreground/70 cursor-pointer group-hover:text-primary transition-colors"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Price Range Section */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 mb-4">
            Price Range
          </h3>
          <Slider defaultValue={[0, 1000]} max={2000} step={50} className="py-4" />
          <div className="flex justify-between mt-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Min</span>
              <span className="text-sm font-bold">$0</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Max</span>
              <span className="text-sm font-bold">$2,000+</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Brand Section */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 mb-4">
            Top Brands
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Samsung', 'NVIDIA', 'ASUS', 'AMD', 'Intel', 'Corsair'].map((brand) => (
              <Button 
                key={brand} 
                variant="outline" 
                className="text-[10px] font-bold h-8 px-3 rounded-full border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                {brand}
              </Button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-destructive transition-colors">
          Clear Filters
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;