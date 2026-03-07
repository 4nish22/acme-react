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
  const itemsPerPage = 9;

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
    <div className="min-h-screen bg-white">
      <div className="border-b border-zinc-50">
        {/* <CategoryBar groups={groups} isLoading={isLoading} /> */}
      </div>

      <main className="mx-auto max-w-[1440px] px-6 lg:px-10 py-12">
        {searchQuery && (
          <div className="mb-8 flex items-center gap-3 bg-zinc-50 w-fit px-4 py-2 rounded-full border border-zinc-100">
            <p className="text-sm font-medium text-zinc-500">
              Showing results for:{" "}
              <span className="text-zinc-900 font-bold">"{searchQuery}"</span>
            </p>
            <button
              onClick={handleClearSearch}
              className="hover:bg-zinc-200 p-1 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-zinc-900" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar
              groups={groups}
              tags={tags}
              isLoading={isLoading}
              selectedGroupIds={selectedGroupIds}
              onGroupChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="mb-8 flex justify-between items-end">
              <h2 className="text-xl font-black text-zinc-900">
                {searchQuery
                  ? "Search Results"
                  : selectedGroupIds.length > 0
                    ? "Filtered Results"
                    : "All Products"}
                <span className="ml-2 text-sm font-medium text-zinc-400">
                  ({totalRecords})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-start min-h-[600px]">
              {isLoading
                ? [...Array(itemsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className="h-[420px] w-full animate-pulse rounded-[32px] bg-zinc-50 border border-zinc-100"
                    />
                  ))
                : productList.map((product) => (
                    <ProductCard key={product.ProductId} product={product} />
                  ))}
            </div>

            {!isLoading && productList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-40 text-zinc-400 border-2 border-dashed border-zinc-50 rounded-[40px]">
                <p className="font-bold uppercase tracking-[0.2em] text-xs">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No Products Found"}
                </p>
                <Button
                  variant="link"
                  onClick={handleReset}
                  className="mt-2 text-zinc-900 font-bold"
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {totalRecords > 0 && (
              <div className="mt-32 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                    Inventory Overview
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    Showing {skipValue + 1} —{" "}
                    {Math.min(skipValue + itemsPerPage, totalRecords)}
                    <span className="text-zinc-400 font-medium ml-1">
                      of {totalRecords} Records
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="w-11 h-11 rounded-xl hover:bg-zinc-100 disabled:opacity-20"
                  >
                    <ChevronLeft className="h-5 w-5 text-zinc-600" />
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {getPageNumbers().map((page, idx) => {
                      if (page === "spacer") {
                        return (
                          <div key={`spacer-${idx}`} className="px-2">
                            <MoreHorizontal className="h-4 w-4 text-zinc-300" />
                          </div>
                        );
                      }
                      const isActive = currentPage === page;
                      return (
                        <Button
                          key={idx}
                          variant={isActive ? "default" : "ghost"}
                          onClick={() => handlePageChange(page as number)}
                          className={`w-11 h-11 rounded-xl text-xs font-black transition-all duration-300 ${
                            isActive
                              ? "bg-zinc-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                              : "text-zinc-500 hover:bg-zinc-100"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="w-11 h-11 rounded-xl hover:bg-zinc-100 disabled:opacity-20"
                  >
                    <ChevronRight className="h-5 w-5 text-zinc-600" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
