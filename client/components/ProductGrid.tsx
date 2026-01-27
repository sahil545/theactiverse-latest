import { ChevronDown } from "lucide-react";
import ColorSwatch from "./ColorSwatch";

interface Product {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  colors: string[];
}

interface ProductGridProps {
  title: string;
  products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  const categories = ["All", "T-shirt", "Hoodie", "Crew Neck shirt", "Polo T-shirt"];

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="relative mb-8">
          <h2 className="font-mirza font-bold text-[48px] leading-[58px]">
            {title}
          </h2>
          <svg className="absolute -top-1 right-0 w-[134px] h-[32px]" viewBox="0 0 134 32" fill="none">
            <path d="M60.5161 3.64148C47.0681 7.61074 16.1376 18.2972 0 29.289C40.8244 34.1742 124.778 35.884 134 3.64148C121.032 0.893534 88.1806 -2.95359 60.5161 3.64148Z" fill="#EBD96B"/>
          </svg>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-10">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`font-amiko ${
                  index === 0 ? 'text-[24px] md:text-[30px] font-bold text-[#032088]' : 'text-[20px] md:text-[27px] font-semibold text-black'
                } hover:text-[#032088] transition`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#525252] hover:bg-gray-50 transition">
              <span className="font-amiko font-semibold text-[18px]">Short By</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#525252] hover:bg-gray-50 transition">
              <span className="font-amiko font-semibold text-[18px]">Filter</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="group">
              {/* Product Image */}
              <div className="relative w-full aspect-[405/589] rounded-[10px] overflow-hidden mb-4">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="font-almarai font-bold text-[18px] leading-[28px] tracking-[-0.715px] capitalize">
                  {product.title}
                </h3>
                <p className="font-amiko text-[16px] leading-[29px] capitalize text-[#0C0C0C]">
                  {product.subtitle}
                </p>
                
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="pt-2">
                    <ColorSwatch
                      colors={product.colors}
                      onColorSelect={() => {}}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-3">
                <span className="font-amiko font-bold text-[16px] leading-[22px] capitalize">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
