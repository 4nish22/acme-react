import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCartStore } from "../../store/useCartStore";
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Check,
  Zap,
  Box,
  Barcode,
} from "lucide-react";
import { useProduct } from "../../api/queries/useProduct";
import { Button } from "../../components/ui/button";
import CartDrawer from "./cart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  const { data: product, isLoading, isError } = useProduct(id);
  const addToCart = useCartStore((state) => state.addToCart);

  const priceOptions = useMemo(() => {
    if (!product) return [];
    return [
      { label: `Sales Rate - ${product.salesRate}`, value: product.salesRate },
      { label: `Alt Sales - ${product.altSalesRate}`, value: product.altSalesRate },
      { label: `Wholesale - ${product.wholesaleRate}`, value: product.wholesaleRate },
    ].filter((option) => option.value > 0);
  }, [product]);

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const activePrice = useMemo(() => {
    if (priceOptions.length === 0) return null;
    return (
      priceOptions.find((opt) => opt.label === selectedLabel) || priceOptions[0]
    );
  }, [priceOptions, selectedLabel]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8F8F7]">
        <Loader2
          className="w-8 h-8 text-zinc-900 animate-spin"
          strokeWidth={1}
        />
      </div>
    );

  if (isError || !product)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F8F7]">
        <h1 className="text-xl font-black uppercase tracking-tighter mb-4 text-zinc-900">
          Registry Null
        </h1>
        <Button
          variant="link"
          onClick={() => navigate("/products")}
          className="text-zinc-500"
        >
          Back to Shop
        </Button>
      </div>
    );

  const imageUrl = `https://demo.acmetech.com.np/api/common/images?module=Product&initial=${localStorage.getItem("company")}&uid=${product.productId}`;

  const handleAddToCart = () => {
    if (!activePrice) return;

    addToCart({
      ProductId: product.productId,
      ProductName: product.productPrintingName,
      Price: activePrice.value,
      Image: imageUrl,
      Quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[#F8F8F7] min-h-screen text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        {/* Top Navigation */}
        <nav className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-900 transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Collection / {product.productGroupDesc}
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Side: Floating Gallery Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 aspect-[4/5] bg-[#F8F8F7] rounded-[40px] overflow-hidden border border-[#F8F8F7] shadow-[0_30px_90px_rgba(0,0,0,0.04)] flex items-center justify-center group">
              <img
                src={imageUrl}
                alt={product.productPrintingName}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/600x800?text=No+Image")
                }
              />

              {product.isTaxable && (
                <div className="absolute top-6 left-6">
                  <div className="bg-zinc-900 text-white rounded-full px-5 py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Zap
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />{" "}
                    Taxable
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: High-Density Information Grid */}
          <div className="lg:col-span-7 flex flex-col pt-4">
            <header className="mb-12 border-b border-zinc-200 pb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {product.productType}
                </span>
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {product.valuationTech}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase mb-6 leading-[0.9] text-zinc-900">
                {product.productPrintingName}
              </h1>
              <p className="text-zinc-600 text-sm leading-relaxed max-w-xl font-medium">
                {product.productDescription ||
                  "Architectural specification for high-performance inventory management and verified stock tracking."}
              </p>
            </header>

            {/* Financial Registry: High Contrast Labels */}
            <section className="mb-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8 border-l-2 border-zinc-900 pl-4">
                Financial Registry / NPR
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
                <PriceItem
                  label="Sales Rate"
                  value={product.salesRate}
                  active={activePrice?.label === "Sales Rate"}
                />
                <PriceItem
                  label="Alt Sales Rate"
                  value={product.altSalesRate}
                  active={activePrice?.label === "Alt Sales"}
                />
                <PriceItem
                  label="Wholesale Rate"
                  value={product.wholesaleRate}
                  active={activePrice?.label === "Wholesale"}
                />
              </div>
            </section>

            {/* Logistics & Identification Grid */}
            <div className="grid grid-cols-2 gap-12 mb-16 pt-12 border-t border-zinc-200">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                  <Box size={14} strokeWidth={2.5} /> Logistics
                </h4>
                <div className="space-y-4">
                  <DataField label="Stock Unit" value={product.productUnit} />
                  <DataField
                    label="Alt Unit"
                    value={product.productAltUnit || "—"}
                  />
                  <DataField label="Category" value={product.productCategory} />
                </div>
              </div>
              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                  <Barcode size={14} strokeWidth={2.5} /> Identification
                </h4>
                <div className="space-y-4">
                  <DataField
                    label="SKU / Short"
                    value={product.productShortName}
                  />
                  <DataField
                    label="Registry ID"
                    value={`#${product.productId}`}
                  />
                  <DataField
                    label="Barcode"
                    value={product.barCodeNo1 || "Pending"}
                  />
                </div>
              </div>
            </div>

            {/* Action Area: Selection + Buy */}
            <div className="mt-auto flex gap-4 items-end">
              {priceOptions.length > 1 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 pl-2">
                    Select Tier
                  </span>
                    {priceOptions.length > 1 && (
                      <div className="flex flex-col gap-3">
                       
                        <Select
                          value={activePrice?.label}
                          onValueChange={(value) => setSelectedLabel(value)}
                        >
                          <SelectTrigger className="h-20 w-[200px] bg-white border-zinc-200 rounded-[24px] text-[11px] font-black uppercase tracking-widest focus:ring-0 focus:ring-offset-0 focus:border-zinc-900 shadow-sm transition-colors">
                            <SelectValue placeholder="Select Tier" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[20px] border-zinc-200 shadow-xl">
                            {priceOptions.map((option) => (
                              <SelectItem
                                key={option.label}
                                value={option.label}
                                className="text-[10px] font-bold uppercase tracking-widest py-3 focus:bg-zinc-900 focus:text-white rounded-lg m-1"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={isAdded || !activePrice}
                className={`flex-1 h-20 rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl ${
                  isAdded
                    ? "bg-green-600 text-white shadow-green-200"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-300"
                }`}
              >
                {isAdded ? (
                  <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                    <Check size={20} strokeWidth={3} /> Added to Cart
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} strokeWidth={2} />
                    <span>Add to Cart</span>
                    <span className="mx-2 opacity-30 text-xs">|</span>
                    <span>Rs. {activePrice?.value.toLocaleString()}</span>
                  </div>
                )}
              </Button>

              <CartDrawer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Refined Helper Components --- */

const PriceItem = ({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string | number;
  active?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col gap-1.5 transition-all duration-500 ${active ? "opacity-100 translate-x-1" : "opacity-40"}`}
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span
        className={`text-2xl tracking-tighter font-black ${active ? "text-zinc-900" : "text-zinc-500"}`}
      >
        {typeof value === "number" ? `Rs. ${value.toLocaleString()}` : value}
      </span>
    </div>
  );
};

const DataField = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-baseline border-b border-zinc-200 pb-3 transition-colors hover:border-zinc-400">
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
      {label}
    </span>
    <span className="text-[11px] font-black uppercase tracking-tight text-zinc-900">
      {value}
    </span>
  </div>
);

export default ProductDetail;
