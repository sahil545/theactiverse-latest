import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories, Category } from "../lib/api";
import { ArrowRight, Zap } from "lucide-react";

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data.slice(0, 4));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories",
        );
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-orange-500" />
            <span className="font-jakarta font-semibold text-orange-600 text-sm uppercase tracking-wider">
              Browse Collections
            </span>
          </div>
          <div className="relative inline-block">
            <h2 className="font-almarai font-bold text-4xl sm:text-5xl md:text-6xl leading-tight text-slate-900">
              Top Categories
            </h2>
            <svg
              className="absolute -bottom-4 left-0 w-full h-6"
              viewBox="0 0 400 32"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20 Q 100 5, 200 20 T 400 20"
                stroke="#EBD96B"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <p className="font-jakarta text-lg text-slate-600 max-w-2xl mx-auto mt-8">
            Explore our premium selection of athletic gear and sportswear across all categories
          </p>
        </div>

        {/* Categories Grid */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-orange-500 mb-4"></div>
              <p className="font-jakarta text-slate-600">Loading categories...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center py-16">
            <p className="font-jakarta text-red-600 bg-red-50 px-6 py-4 rounded-lg">
              {error}
            </p>
          </div>
        )}
        
        {!loading && !error && categories.length === 0 && (
          <div className="flex justify-center py-16">
            <p className="font-jakarta text-slate-600 bg-slate-100 px-6 py-4 rounded-lg">
              No categories available
            </p>
          </div>
        )}
        
        {!loading && !error && categories.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {categories.map((category, index) => (
                <Link
                  to={`/category/${category.category_id || category.id}`}
                  key={category.id || category.category_slug || index}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-orange-200"
                >
                  <div className="relative w-full aspect-square bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {category.category_image && (
                      <img
                        src={category.category_image}
                        alt={category.category_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300"></div>

                    {/* Badge - Top Left */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <span className="font-jakarta font-bold text-xs text-slate-900 uppercase tracking-wide">
                        Shop Now
                      </span>
                    </div>

                    {/* Content - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center">
                      <h3 className="font-almarai font-bold text-white text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
                        {category.category_name}
                      </h3>
                      
                      {/* CTA Arrow - Visible on Hover */}
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <span className="font-jakarta font-semibold text-white text-sm">
                          Explore
                        </span>
                        <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-jakarta font-bold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                View All Categories
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
