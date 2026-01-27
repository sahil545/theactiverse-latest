import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComingSoonSection() {
  const products = [
    {
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/ec5a0af0776fde07eb60d29901eb761f44019d2e?width=1700",
      title: "Pointing finger T-Shirt",
    },
    {
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/eb67b967834d1ac85081d36cf4c3adf7ce8a1171?width=1700",
      title: "flat color wall T-Shirt",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <h2 className="font-mirza font-bold text-[36px] md:text-[48px] leading-[48px] md:leading-[58px]">
              Coming Soon
            </h2>
            <svg
              className="absolute -top-1 left-[167px] w-[95px] h-[29px]"
              viewBox="0 0 95 29"
              fill="none"
            >
              <path
                d="M42.9032 3.30009C33.3692 6.89723 11.4409 16.5818 0 26.5431C28.9427 30.9704 88.4624 32.5199 95 3.30009C85.8064 0.809765 62.5161 -2.67669 42.9032 3.30009Z"
                fill="#EBD96B"
              />
            </svg>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#525252] hover:bg-gray-50 transition"
          >
            <span className="font-amiko font-bold text-[18px]">See all</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-20">
          {products.map((product, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-[850/552] rounded-[26px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 rounded-[26px]"></div>
              </div>

              {/* Product Info Card */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white rounded-[20px] md:rounded-[28px] px-4 md:px-8 lg:px-11 py-4 md:py-5 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="font-amiko font-bold text-[20px] md:text-[28px] lg:text-[32px] leading-[28px] md:leading-[38px] tracking-[0.64px]">
                    {product.title}
                  </h3>

                  <Link
                    to="/shop"
                    className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg border border-[#525252] hover:bg-gray-50 transition whitespace-nowrap"
                  >
                    <span className="font-amiko font-semibold text-[18px]">
                      Shop Now
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
