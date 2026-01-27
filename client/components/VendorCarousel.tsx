import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { Vendor, getVendors } from "@/lib/api";
import { Link } from "react-router-dom";

export default function VendorCarousel() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    const data = await getVendors();
    setVendors(data);
    setLoading(false);
  };

  const itemsPerView = 5;
  const canScrollLeft = currentIndex > 0;
  const canScrollRight =
    currentIndex < Math.max(0, vendors.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(vendors.length - itemsPerView, currentIndex + 1));
  };

  const visibleVendors = vendors.slice(
    currentIndex,
    currentIndex + itemsPerView,
  );

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="font-jakarta font-semibold text-blue-600 text-sm uppercase tracking-wider">
              Partner Network
            </span>
          </div>
          <h2 className="font-almarai font-bold text-4xl sm:text-5xl md:text-6xl leading-tight text-slate-900 mb-6">
            Our Vendors
          </h2>
          <p className="font-jakarta text-lg text-slate-600 max-w-2xl mx-auto">
            Discover premium brands and trusted sellers offering quality products for active lifestyles
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
            </div>
            <p className="mt-4 font-jakarta text-slate-600">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-jakarta text-slate-600">No vendors available</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={!canScrollLeft}
                className="flex-shrink-0 p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-slate-200"
              >
                <ChevronLeft className="w-6 h-6 text-slate-900" />
              </button>

              {/* Vendors Grid */}
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {visibleVendors.map((vendor) => (
                    <Link
                      key={vendor.id}
                      to={`/vendor/${vendor.id}`}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 h-auto flex flex-col"
                    >
                      {vendor.photo ? (
                        <>
                          {/* Image Container */}
                          <div className="relative h-40 overflow-hidden bg-slate-200">
                            <img
                              src={vendor.photo}
                              alt={vendor.shop_name || vendor.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>

                            {/* Badge - Top Right */}
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-md">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            {/* Vendor Name */}
                            <h3 className="font-jakarta font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-3">
                              {vendor.shop_name || vendor.name}
                            </h3>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs font-jakarta text-slate-600">
                              <span className="flex items-center gap-1">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                Active
                              </span>
                              <span className="text-blue-600 font-semibold">
                                Premium
                              </span>
                            </div>

                            {/* CTA - Visible on Hover */}
                            <button className="mt-3 w-full py-2 rounded-lg bg-blue-600 text-white font-jakarta font-semibold text-xs hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              View Shop
                            </button>
                          </div>
                        </>
                      ) : (
                        // Fallback for no photo
                        <div className="flex flex-col items-center justify-center h-48 w-full bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-full blur-lg"></div>
                            <ShoppingBag className="w-8 h-8 text-blue-600 relative z-10" />
                          </div>
                          <p className="text-sm font-jakarta font-bold text-slate-900 text-center truncate mt-4 px-2 line-clamp-2">
                            {vendor.shop_name || vendor.name}
                          </p>
                          <span className="text-xs text-blue-600 mt-2">
                            Premium Seller
                          </span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!canScrollRight}
                className="flex-shrink-0 p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-slate-200"
              >
                <ChevronRight className="w-6 h-6 text-slate-900" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && vendors.length > 0 && (
          <div className="mt-16 text-center">
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-jakarta font-bold hover:bg-slate-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Explore All Vendors
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
