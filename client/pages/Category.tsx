import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCategoryWithProducts, CategoryWithProducts } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Star } from "lucide-react";
import ProductRatingBadge from "@/components/ProductRatingBadge";

export default function Category() {
  const { category_id } = useParams<{ category_id: string }>();
  const [categoryData, setCategoryData] = useState<CategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoryIdNumber = parseInt(category_id || "0", 10);
        const data = await getCategoryWithProducts(categoryIdNumber);
        setCategoryData(data);
        if (data && data.sub_categories.length > 0) {
          setActiveSubCategoryId(data.sub_categories[0].sub_category_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch category data");
        setCategoryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category_id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-orange-500 mb-4"></div>
              <p className="font-jakarta text-slate-600">Loading category...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !categoryData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-2xl px-6">
              <p className="font-jakarta text-red-600 mb-6 text-center">
                {error || "Failed to load category"}
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-jakarta font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const activeSubCategory = categoryData.sub_categories.find(
    (sub) => sub.sub_category_id === activeSubCategoryId
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <section className="w-full py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-jakarta font-semibold text-sm group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Categories
            </button>
          </div>
        </section>

        {/* Category Hero Section */}
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Image */}
              {categoryData.category_image && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-600/20 rounded-3xl"></div>
                  <img
                    src={categoryData.category_image}
                    alt={categoryData.category_name}
                    className="w-full rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10"
                  />
                </div>
              )}

              {/* Right - Content */}
              <div className="space-y-8">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-jakarta font-semibold text-sm mb-6">
                    <ShoppingCart className="w-4 h-4" />
                    Featured Category
                  </span>
                  <h1 className="font-almarai font-bold text-5xl md:text-6xl lg:text-7xl leading-tight text-slate-900 mb-6">
                    {categoryData.category_name}
                  </h1>
                </div>

                <p className="font-jakarta text-lg text-slate-600 leading-relaxed max-w-lg">
                  Explore our extensive collection of premium {categoryData.category_name.toLowerCase()} gear. Browse through various subcategories and discover the perfect equipment for your athletic needs.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-2xl font-almarai font-bold text-slate-900">
                      {categoryData.sub_categories.length}
                    </div>
                    <p className="font-jakarta text-xs text-slate-600 mt-1">
                      Subcategories
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-2xl font-almarai font-bold text-slate-900">
                      {categoryData.sub_categories.reduce((sum, sub) => sum + sub.products.length, 0)}
                    </div>
                    <p className="font-jakarta text-xs text-slate-600 mt-1">
                      Products
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-almarai font-bold text-slate-900">4.9</span>
                    </div>
                    <p className="font-jakarta text-xs text-slate-600 mt-1">
                      Rating
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-jakarta font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
                  <ShoppingCart className="w-5 h-5" />
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories & Products */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* SubCategories Tabs */}
            {categoryData.sub_categories.length > 0 && (
              <div className="mb-16">
                <h2 className="font-almarai font-bold text-3xl md:text-4xl text-slate-900 mb-8">
                  Browse by Type
                </h2>
                <div className="flex flex-wrap gap-3">
                  {categoryData.sub_categories.map((subCategory) => (
                    <button
                      key={subCategory.sub_category_id}
                      onClick={() => setActiveSubCategoryId(subCategory.sub_category_id)}
                      className={`px-6 py-3 rounded-full font-jakarta font-semibold text-sm md:text-base whitespace-nowrap transition-all duration-300 border-2 ${
                        activeSubCategoryId === subCategory.sub_category_id
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                          : "bg-white text-slate-900 border-slate-200 hover:border-slate-900"
                      }`}
                    >
                      {subCategory.sub_category_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {activeSubCategory && activeSubCategory.products.length > 0 ? (
              <div>
                <div className="mb-12">
                  <h2 className="font-almarai font-bold text-3xl md:text-4xl text-slate-900 mb-2">
                    {activeSubCategory.sub_category_name}
                  </h2>
                  <p className="font-jakarta text-slate-600">
                    Showing {activeSubCategory.products.length} products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activeSubCategory.products.map((product) => (
                    <div
                      key={product.product_id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/product/${product.product_id}`)}
                    >
                      {/* Product Image */}
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-5 bg-slate-100 border border-slate-200 group-hover:border-orange-300 transition-colors">
                        <img
                          src={product.product_thumbnail}
                          alt={product.product_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ShoppingCart className="w-5 h-5 text-slate-900" />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <h3 className="font-jakarta font-bold text-base md:text-lg leading-snug text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {product.product_name}
                        </h3>

                        {/* Rating Badge */}
                        <div>
                          <ProductRatingBadge productId={product.product_id} compact />
                        </div>

                        {/* Colors and Sizes */}
                        {(product.product_colors || product.product_sizes) && (
                          <div className="space-y-1 text-xs">
                            {product.product_colors && (
                              <p className="text-slate-600">
                                <span className="font-semibold">Colors:</span> {product.product_colors.split(",").map(c => c.trim()).join(", ")}
                              </p>
                            )}
                            {product.product_sizes && (
                              <p className="text-slate-600">
                                <span className="font-semibold">Sizes:</span> {product.product_sizes.split(",").map(s => s.trim()).join(", ")}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="bg-slate-50 rounded-lg px-3 py-2">
                            <p className="text-xs font-jakarta text-slate-500 mb-0.5 uppercase tracking-wide">Price</p>
                            <p className="font-almarai font-bold text-xl text-slate-700">
                              ${product.product_price.toLocaleString("en-US")}
                            </p>
                          </div>
                          <button className="p-2 rounded-lg bg-orange-100 text-orange-600 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-600 hover:text-white">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl">
                <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
                <p className="font-jakarta text-slate-600 text-lg">
                  No products available in this subcategory
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
