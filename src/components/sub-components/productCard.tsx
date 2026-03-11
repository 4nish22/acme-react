import { Plus } from "lucide-react";
import type { Product } from "../../types/product";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  if (!product || !product.ProductId) return null;

  const isOutOfStock = product.StockQty <= 0;
  const apiImage = `https://demo.acmetech.com.np/api/common/images?module=Product&initial=${localStorage.getItem("company")}&uid=${product.ProductId}`;
  const placeholderImage = `https://placehold.co/600x600/FFFFFF/000000?text=${encodeURIComponent(product.ProductPrintingName)}`;

  return (
    <div
      onClick={() => {
        navigate(`/product/${product.ProductId}`);
        window.scrollTo({ top: 0, behavior: "instant" });
      }}
      className="group bg-white border border-zinc-100 rounded-[28px] p-3.5 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:border-zinc-200"
    >
      <div className="relative aspect-square overflow-hidden rounded-[22px] bg-zinc-50 border border-zinc-100">
        <img
          src={apiImage}
          alt={product.ProductPrintingName}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
            target.classList.add("p-12", "opacity-10", "object-contain");
          }}
          className={`h-full w-full object-fit transition-transform duration-700 ease-out group-hover:scale-110 ${
            isOutOfStock ? "grayscale opacity-40" : ""
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
            <span className="px-3 py-1 bg-white text-zinc-900 border-none rounded-md shadow-sm text-[10px] font-black uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 pb-0.5 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <span>{product.ProductGrpDesc}</span>
          <span className={isOutOfStock ? "text-red-500" : ""}>
            {product.StockQty} {product.ProductUnit}
          </span>
        </div>

        <h3 className="text-[15px] font-bold text-zinc-900 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {product.ProductPrintingName}
        </h3>

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-50">
          <div className="flex items-baseline gap-1.5">
            {product.MRP > product.SalesRate && (
              <span className="text-[11px] text-zinc-300 line-through font-bold">
                {product.MRP.toLocaleString()}
              </span>
            )}
            <span className="text-[19px] font-black text-zinc-900 tracking-tighter leading-none">
              Rs. {product.SalesRate.toLocaleString()}
            </span>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-20 transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
