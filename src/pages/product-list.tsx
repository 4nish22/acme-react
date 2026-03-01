import ProductCard from "../components/sub-components/productCard";
import FilterSidebar from "../components/sub-components/filterSideBar";

// This is the simplified data mapped from your API structure
const dummyProducts = [
  {
    id: 205,
    name: "64GB DDR4-2933 MHz RDIMM Samsung",
    brand: "Samsung",
    price: 299.99,
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=500",
  },
  {
    id: 206,
    name: "32GB DDR4-3200 MHz UDIMM Crucial",
    brand: "Crucial",
    price: 89.5,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=500",
  },
  {
    id: 207,
    name: "1TB NVMe Gen4 SSD WD_Black",
    brand: "Western Digital",
    price: 120.0,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1597872200370-493cedf86598?q=80&w=500",
  },
  {
    id: 208,
    name: "RTX 4070 Super 12GB OC Edition",
    brand: "NVIDIA",
    price: 599.0,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?q=80&w=500",
  },
  {
    id: 209,
    name: "Ryzen 9 7950X Desktop Processor",
    brand: "AMD",
    price: 549.99,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=500",
  },
  {
    id: 210,
    name: "Z790 Motherboard WiFi 6E",
    brand: "ASUS",
    price: 249.0,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500",
  },
  {
    id: 211,
    name: "850W Gold Fully Modular PSU",
    brand: "Corsair",
    price: 135.0,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=500",
  },
  {
    id: 212,
    name: "Liquid Cooler 360mm RGB White",
    brand: "NZXT",
    price: 180.0,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=500",
  },
];

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Sidebar: Fixed width to prevent shrinking */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Product Grid on the Right */}
          <div className="flex-1">
            <div className="flex flex-col mb-10 pb-6 border-b border-border/40">
              <h1 className="text-4xl font-black tracking-tight uppercase">
                Hardware <span className="text-primary/80">Catalog</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Premium components for your build.
              </p>
            </div>

            {/* Increased gap-x-8 for a cleaner look. 
                Added 2xl:grid-cols-4 so it fills the 1440px width perfectly on big screens.
            */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {dummyProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
