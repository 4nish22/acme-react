import { ShoppingCart, Package } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Product } from "../../types/product";

const ProductCard = ({ product }: { product: Product }) => {
  if (!product || !product.name) return null;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-border/40 bg-white p-3 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "grayscale opacity-60" : ""}`}
        />
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col pt-4 pb-2">
        <div className="flex justify-between items-start">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>{product.stock} in stock</span>
          </div>
        </div>

        <h3 className="mt-1 text-sm font-bold line-clamp-2 h-10 text-foreground/90">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-black text-primary">
            ${product.price.toLocaleString()}
          </span>
          <Button
            disabled={isOutOfStock}
            size="sm"
            className="rounded-full h-9 px-4 shadow-none hover:shadow-md transition-shadow"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
