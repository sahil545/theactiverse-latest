import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product, getProducts, getProductImageUrl } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimilarProductsCarouselProps {
  currentProductId: number;
  vendorId: number;
}

export default function SimilarProductsCarousel({
  currentProductId,
  vendorId,
}: SimilarProductsCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarProducts();
  }, [vendorId, currentProductId]);

  const fetchSimilarProducts = async () => {
    setLoading(true);
    const allProducts = await getProducts();
    const similar = allProducts.filter(
      (p) => p.vendor_id === vendorId && p.product_id !== currentProductId,
    );
    setProducts(similar);
    setLoading(false);
  };

  const itemsPerView = 4;
  const canScrollLeft = currentIndex > 0;
  const canScrollRight =
    currentIndex < Math.max(0, products.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(products.length - itemsPerView, currentIndex + 1));
  };

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView,
  );

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Similar Products</h2>

      <div className="relative">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className="flex-shrink-0 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <Link
                  key={product.product_id}
                  to={`/product/${product.product_id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gray-200 h-48 overflow-hidden flex items-center justify-center">
                    <img
                      src={getProductImageUrl(product.product_thumbnail)}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600">
                      {product.product_name}
                    </h3>
                    <div className="bg-slate-50 rounded-lg px-3 py-2 inline-block">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Price</p>
                      <p className="text-lg font-bold text-slate-700">
                        ${product.product_price.toLocaleString("en-US")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canScrollRight}
            className="flex-shrink-0 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
