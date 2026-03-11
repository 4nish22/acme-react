import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/sub-components/productCard";
import FilterSidebar from "../../components/sub-components/filterSideBar";
import { useProducts } from "../../api/queries/useProduct";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, X } from "lucide-react";

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const itemsPerPage = 12;

  const searchQuery = searchParams.get("search") || "";
  const skipValue = (currentPage - 1) * itemsPerPage;

  const groupIdsString = useMemo(() => {
    return selectedGroupIds.length > 0 ? selectedGroupIds.join(",") : undefined;
  }, [selectedGroupIds]);

  const { data, groups, tags, isLoading } = useProducts({
    "Context.ProductId": 0,
    "Context.ProductGrpIds": groupIdsString,
    SearchKey: searchQuery,
    Take: itemsPerPage,
    Skip: skipValue,
    SelectAll: false,
  });

  const productList = data?.products || [];
  const totalRecords = data?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handleFilterChange = (newIds: number[]) => {
    setSelectedGroupIds(newIds);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedGroupIds([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "spacer")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("spacer");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("spacer");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-zinc-900">
      <main className="mx-auto max-w-[1600px] px-6 lg:px-12 py-12">
        
        {/* Search Breadcrumb / Active State */}
        {searchQuery && (
          <div className="mb-10 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-zinc-200 pl-4 pr-2 py-1.5 rounded-full shadow-sm">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Search:</span>
              <span className="text-sm font-bold text-zinc-900">"{searchQuery}"</span>
              <button
                onClick={handleClearSearch}
                className="ml-2 p-1 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            </div>
            <span className="text-xs font-medium text-zinc-400">{totalRecords} results found</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filter Section - No Label, Just Content */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-12">
              <FilterSidebar
                groups={groups}
                tags={tags}
                isLoading={isLoading}
                selectedGroupIds={selectedGroupIds}
                onGroupChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {!searchQuery && (
              <div className="mb-10 pb-6 border-b border-zinc-200 flex items-baseline justify-between">
                <h1 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">
                  Collection <span className="text-zinc-900 ml-2">/ {totalRecords}</span>
                </h1>
              </div>
            )}

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-h-[600px]">
              {isLoading
                ? [...Array(itemsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-zinc-200/60"
                    />
                  ))
                : productList.map((product) => (
                    <ProductCard key={product.ProductId} product={product} />
                  ))}
            </div>

            {/* Empty State */}
            {!isLoading && productList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-40 bg-zinc-100/50 rounded-[32px] border-2 border-dashed border-zinc-200">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                  No matches found
                </p>
                <Button
                  onClick={handleReset}
                  className="bg-white text-zinc-900 border border-zinc-200 rounded-full px-8 py-2 font-bold hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                >
                  Clear Selection
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalRecords > 0 && (
              <footer className="mt-24 py-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-xs font-bold text-zinc-400 tracking-tight">
                  <span className="text-zinc-900">{skipValue + 1}—{Math.min(skipValue + itemsPerPage, totalRecords)}</span> 
                  <span className="mx-2">of</span> 
                  {totalRecords}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="h-10 w-10 p-0 rounded-full bg-white border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-20"
                  >
                    <ChevronLeft size={18} />
                  </Button>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-full">
                    {getPageNumbers().map((page, idx) => {
                      if (page === "spacer") {
                        return <MoreHorizontal key={idx} className="h-3 w-3 text-zinc-300" />;
                      }
                      const isActive = currentPage === page;
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(page as number)}
                          className={`w-7 h-7 text-[11px] font-bold rounded-full transition-all ${
                            isActive
                              ? "bg-zinc-900 text-white"
                              : "text-zinc-400 hover:text-zinc-900"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="h-10 w-10 p-0 rounded-full bg-white border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-20"
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </footer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;