import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Barcode,
  Box,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useProducts } from "../../api/queries/useProduct";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useProducts();

  const product = data?.products?.find((p) => p.ProductId === Number(id));
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-xs uppercase tracking-[0.2em] text-zinc-500">
        Loading Specifications...
      </div>
    );
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center font-bold">
        Record not found
      </div>
    );

  const placeholderImage = `https://placehold.co/600x600/FFFFFF/18181b?text=${encodeURIComponent(product.ProductPrintingName)}`;
  const imageUrl = `https://demo.acmetech.com.np/api/common/images?module=Product&initial=${localStorage.getItem('company')}&uid=${product.ProductId}`;

  return (
    <div className="bg-background min-h-screen text-zinc-900 pb-20">
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors mb-16"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5">
            <div className="sticky top-28 aspect-square bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 flex items-center justify-center shadow-sm">
              <img
                src={imageUrl}
                alt={product.ProductPrintingName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== placeholderImage) {
                    target.src = placeholderImage;

                    target.classList.add(
                      "border-zinc-900",
                      "rounded-2xl",
                      "scale-[0.9]",
                    );
                  }
                }}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <header className="border-b border-zinc-100 pb-10">
              <div className="flex gap-3 mb-6">
                <Badge
                  variant="outline"
                  className="rounded-full border-zinc-200 text-zinc-600 px-4 py-1 text-[11px] uppercase font-bold tracking-wider"
                >
                  {product.ProductType}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-zinc-200 text-zinc-600 px-4 py-1 text-[11px] uppercase font-bold tracking-wider"
                >
                  {product.ProductCategory}
                </Badge>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
                {product.ProductPrintingName}
              </h1>
              <p className="text-zinc-500 text-xl leading-relaxed max-w-lg font-medium">
                {product.ProductDesc}
              </p>
            </header>

            <section className="py-10 border-b border-zinc-100">
              <div className="flex items-baseline gap-6 mb-10">
                <span className="text-5xl font-black tracking-tighter text-zinc-900">
                  NPR {product.SalesRate.toLocaleString()}
                </span>
                {product.MRP > 0 && (
                  <span className="text-2xl text-zinc-300 line-through font-bold">
                    NPR {product.MRP.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-8 py-8 px-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                <PriceItem label="Wholesale" value={product.WholesaleRate} />
                <PriceItem label="Trade Rate" value={product.TradeRate} />
                <PriceItem label="Menu Rate" value={product.MenuRate} />
              </div>
            </section>

            <section className="py-12 space-y-16">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                  <Box className="h-4 w-4" /> Inventory Status
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  <DataRow
                    label="Current Stock"
                    value={`${product.StockQty} ${product.ProductUnit}`}
                    highlight
                  />
                  <DataRow
                    label="Alternative Stock"
                    value={`${product.AltStockQty} ${product.ProductAltUnit || "N/A"}`}
                  />
                  <DataRow label="Conversion Factor" value={product.QtyConv} />
                  <DataRow label="Alt Conversion" value={product.AltConv} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                  <Barcode className="h-4 w-4" /> Logistics Data
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  <DataRow
                    label="SKU / Short Name"
                    value={product.ProductShortName}
                  />
                  <DataRow
                    label="HS Code"
                    value={product.HsCode || "Unclassified"}
                  />
                  <DataRow
                    label="Barcode"
                    value={product.BarCodeNo1 || "N/A"}
                  />
                  <DataRow label="Product ID" value={product.ProductId} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Classifications
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  <DataRow
                    label="Group Description"
                    value={product.ProductGrpDesc}
                  />
                  <DataRow
                    label="Sub-Group"
                    value={product.ProductSubGrpDesc}
                  />
                  <DataRow
                    label="Unit Tracking"
                    value={product.IsBatchwise ? "Batch Enabled" : "No Batch"}
                  />
                  <StatToggle
                    label="Taxable Item"
                    isActive={product.IsTaxable}
                  />
                </div>
              </div>
            </section>

            <div className="pt-10 flex gap-4">
              <Button className="flex-1 h-16 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all text-sm font-bold uppercase tracking-widest shadow-xl shadow-zinc-200">
                <ShoppingCart className="mr-3 h-5 w-5" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className="h-16 w-16 rounded-2xl border-zinc-200 hover:bg-zinc-50"
              >
                <ShieldCheck className="h-6 w-6 text-zinc-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceItem = ({ label, value }: { label: string; value: number }) => (
  <div>
    <p className="text-[11px] font-black text-zinc-500 uppercase tracking-wider mb-2">
      {label}
    </p>
    <p className="text-lg font-bold text-zinc-900 leading-none">
      Rs. {value.toLocaleString()}
    </p>
  </div>
);

const DataRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`text-base font-semibold ${highlight ? "text-zinc-900 font-bold" : "text-zinc-700"}`}
    >
      {value}
    </span>
  </div>
);

const StatToggle = ({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`text-[11px] w-fit px-3 py-1 font-bold uppercase rounded-md tracking-wider ${isActive ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"}`}
    >
      {isActive ? "Verified Taxable" : "Non-Taxable"}
    </span>
  </div>
);

export default ProductDetail;
