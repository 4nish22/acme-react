import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import type { ProductGroup } from "../../types/product";

interface CategoryBarProps {
  groups: ProductGroup[];
  isLoading: boolean;
}

const CategoryBar = ({ groups, isLoading }: CategoryBarProps) => {
  const getStockImage = (index: number) =>
    `https://picsum.photos/seed/${index + 100}/200`;

  const isLargeSet = groups && groups.length >= 6;
  const itemBasis = isLargeSet 
    ? "lg:basis-1/6 md:basis-1/5 sm:basis-1/4 basis-1/2" 
    : "lg:basis-1/5 md:basis-1/3 sm:basis-1/2 basis-1/2";

  return (
    <div className="w-full bg-white pt-10 pb-12">
      <div className="mx-auto max-w-[1440px] px-12 lg:px-16">
        
        {/* Centered Header Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">
            Explore Collection
          </h2>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter sm:text-4xl">
            Our Categories
          </h1>
          <div className="mt-4 h-1 w-12 bg-zinc-900 rounded-full" />
        </div>

        {/* Carousel Component */}
        <Carousel
          opts={{
            align: isLargeSet ? "start" : "center", // Center small sets for better aesthetics
            loop: false,
          }}
          className="w-full group/carousel"
        >
          <CarouselContent className="-ml-4">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <CarouselItem key={i} className={`pl-4 ${itemBasis}`}>
                  <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-zinc-100 border border-zinc-50" />
                    <div className="h-3 w-16 bg-zinc-50 rounded-full" />
                  </div>
                </CarouselItem>
              ))
            ) : (
              groups?.map((group, index) => (
                <CarouselItem 
                  key={group.ProductGrpId} 
                  className={`pl-4 ${itemBasis}`}
                >
                  <button className="group flex flex-col items-center gap-4 w-full outline-none">
                    <div className="relative">
                      {/* Image Ring Effect */}
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent transition-all duration-300 group-hover:border-zinc-900 group-hover:p-1 group-active:scale-95 shadow-sm group-hover:shadow-xl">
                        <img
                          src={getStockImage(index)}
                          alt={group.ProductGrpDesc}
                          className="h-full w-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400 transition-colors group-hover:text-zinc-900 text-center px-1 line-clamp-1">
                      {group.ProductGrpDesc}
                    </span>
                  </button>
                </CarouselItem>
              ))
            )}
          </CarouselContent>

          {/* Navigation Controls - Only show if there's enough items to scroll */}
          {groups && groups.length > (isLargeSet ? 6 : 4) && (
            <>
              <CarouselPrevious className="hidden md:flex -left-6 lg:-left-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-white border-zinc-100 shadow-md hover:bg-zinc-900 hover:text-white" />
              <CarouselNext className="hidden md:flex -right-6 lg:-right-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-white border-zinc-100 shadow-md hover:bg-zinc-900 hover:text-white" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryBar;