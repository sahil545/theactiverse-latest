import { useState, useEffect } from "react";
import { getCategoryWithProducts, CategoryWithProducts } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import ProductRatingBadge from "./ProductRatingBadge";

interface CategoryWithProductsSectionProps {
  categoryId: number;
}

export default function CategoryWithProductsSection({
  categoryId,
}: CategoryWithProductsSectionProps) {
  const [categoryData, setCategoryData] = useState<CategoryWithProducts | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryWithProducts(categoryId);
        setCategoryData(data);
        if (data && data.sub_categories.length > 0) {
          setActiveSubCategoryId(data.sub_categories[0].sub_category_id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch category data",
        );
        setCategoryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !categoryData) {
    return (
      <section className="w-full py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-12">
            <p className="text-red-600 bg-red-50 px-6 py-4 rounded-lg font-jakarta">
              {error || "Failed to load category"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const activeSubCategory = categoryData.sub_categories.find(
    (sub) => sub.sub_category_id === activeSubCategoryId,
  );

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <span className="font-jakarta font-semibold text-blue-600 text-sm uppercase tracking-wider">
              Featured Collection
            </span>
          </div>

          <div className="flex items-start justify-between mb-4">
            <h2 className="font-almarai font-bold text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-tight">
              {categoryData.category_name}
            </h2>
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-blue-600 hidden sm:block flex-shrink-0" />
          </div>

          <p className="font-jakarta text-slate-600 text-lg max-w-2xl">
            Discover our premium collection of{" "}
            {categoryData.category_name.toLowerCase()} products
          </p>
        </div>

        {/* SubCategories Tabs */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categoryData.sub_categories.map((subCategory) => (
              <button
                key={subCategory.sub_category_id}
                onClick={() =>
                  setActiveSubCategoryId(subCategory.sub_category_id)
                }
                className={`px-5 md:px-6 py-3 rounded-full whitespace-nowrap font-jakarta font-semibold text-sm md:text-base transition-all duration-300 ${
                  activeSubCategoryId === subCategory.sub_category_id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                {subCategory.sub_category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {activeSubCategory && activeSubCategory.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
            {activeSubCategory.products.map((product) => (
              <div
                key={product.product_id}
                onClick={() => navigate(`/product/${product.product_id}`)}
                className="group cursor-pointer h-full hijack"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
                    <p className="font-almarai font-bold text-2 md:text-3 text-slate-700 cat_prod_size">
                      ${product.product_price.toLocaleString("en-US")}
                    </p>
                    <img
                      src={product.product_thumbnail}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Quick View Badge */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="font-almarai font-bold text-base md:text-lg leading-tight text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.product_name}
                    </h3>

                    {/* Rating Badge */}
                    <div className="mb-3">
                      <ProductRatingBadge
                        productId={product.product_id}
                        compact
                      />
                    </div>

                    {/* Colors and Sizes */}
                    {(product.product_colors || product.product_sizes) && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        {product.product_colors && (
                          <div>
                            <p className="text-xs font-jakarta text-slate-500 font-semibold mb-1 uppercase tracking-wide">
                              Colors:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {product.product_colors
                                .split(",")
                                .map((color) => color.trim())
                                .slice(0, 3)
                                .map((color) => (
                                  <span
                                    key={color}
                                    className="text-xs font-jakarta font-semibold px-2 py-1 bg-slate-100 rounded text-slate-700"
                                  >
                                    {color}
                                  </span>
                                ))}
                              {product.product_colors.split(",").length > 3 && (
                                <span className="text-xs font-jakarta text-slate-600">
                                  +
                                  {product.product_colors.split(",").length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {product.product_sizes && (
                          <div>
                            <p className="text-xs font-jakarta text-slate-500 font-semibold mb-1 uppercase tracking-wide">
                              Sizes:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {product.product_sizes
                                .split(",")
                                .map((size) => size.trim())
                                .map((size) => (
                                  <span
                                    key={size}
                                    className="text-xs font-jakarta font-semibold px-2 py-1 bg-slate-100 rounded text-slate-700"
                                  >
                                    {size}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price and CTA */}
                    <div className="mt-auto pt-4 border-t border-slate-200 space-y-3">
                      {/*}<div className="bg-slate-50 rounded-lg px-4 py-3 inline-block">
                        <p className="text-xs font-jakarta text-slate-500 uppercase tracking-wide mb-1">Price</p>
                        <p className="font-almarai font-bold text-2xl md:text-3xl text-slate-700">
                          ${product.product_price.toLocaleString("en-US")}
                        </p>
                      </div>*/}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/product/${product.product_id}`);
                        }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-jakarta font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="font-jakarta text-slate-600 text-lg">
                No products available in this subcategory
              </p>
            </div>
          </div>
        )}

        {/* View All CTA */}
        {activeSubCategory && activeSubCategory.products.length > 0 && (
          <div className="text-center pt-4">
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-jakarta font-bold rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
