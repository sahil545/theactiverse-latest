import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Vendor, getVendors } from "@/lib/api";
import { Link } from "react-router-dom";
import { MapPin, Mail, Star, ArrowRight } from "lucide-react";

const VENDORS_PER_PAGE = 12;

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [searchTerm, vendors]);

  const fetchVendors = async () => {
    setLoading(true);
    const vendorsList = await getVendors();
    setVendors(vendorsList);
    setFilteredVendors(vendorsList);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...vendors];

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          (v.shop_name || v.name)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          v.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredVendors(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredVendors.length / VENDORS_PER_PAGE);
  const startIndex = (currentPage - 1) * VENDORS_PER_PAGE;
  const paginatedVendors = filteredVendors.slice(
    startIndex,
    startIndex + VENDORS_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section with Background */}
      <div className="relative py-20 md:py-28 overflow-hidden mb-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop')`,
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/75 to-blue-900/70"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="font-almarai font-bold text-5xl md:text-6xl text-white mb-4">
              Explore Our Vendors
            </h1>
            <p className="font-jakarta text-lg text-white/90 max-w-3xl mx-auto">
              Discover amazing products from our trusted vendors. Each vendor is
              carefully selected to ensure quality and excellent customer service.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vendors by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-6 py-4 border-2 border-white/30 rounded-xl bg-white/95 backdrop-blur-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-200 font-jakarta transition-all shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={handleReset}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-sm text-white/80 mt-3 text-center font-jakarta">
              Showing <span className="font-bold text-white">{paginatedVendors.length}</span> of <span className="font-bold text-white">{filteredVendors.length}</span> vendors
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-2xl font-almarai text-slate-900 mb-4">
              No vendors found matching your search.
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-jakarta font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {paginatedVendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  to={`/vendor/${vendor.id}`}
                  className="group h-full"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-slate-200 hover:border-blue-300">
                    {/* Image Section */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden flex-shrink-0">
                      {vendor.photo ? (
                        <img
                          src={vendor.photo}
                          alt={vendor.shop_name || vendor.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl font-almarai font-bold text-white mb-2">
                              {(vendor.shop_name || vendor.name).charAt(0).toUpperCase()}
                            </div>
                            <p className="text-blue-100 font-jakarta text-sm">
                              {(vendor.shop_name || vendor.name).slice(0, 15)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm text-blue-600 rounded-full text-xs font-jakarta font-bold shadow-md">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col">
                      {/* Vendor Name */}
                      <h3 className="text-lg font-almarai font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                        {vendor.shop_name || vendor.name}
                      </h3>

                      {/* Operator Name */}
                      <p className="text-sm font-jakarta text-slate-600 mb-3">
                        {vendor.name}
                      </p>

                      {/* Description */}
                      {vendor.shop_description && (
                        <p className="text-xs font-jakarta text-slate-600 mb-4 line-clamp-2 flex-1">
                          {vendor.shop_description}
                        </p>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        {vendor.email && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="truncate">{vendor.email}</span>
                          </div>
                        )}
                        {vendor.address && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="line-clamp-1">{vendor.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Member Since */}
                      <p className="text-xs font-jakarta text-slate-500 mb-4 pb-4 border-t border-slate-100">
                        Member since{" "}
                        <span className="text-slate-700 font-semibold">
                          {new Date(vendor.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                            },
                          )}
                        </span>
                      </p>

                      {/* CTA Button */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                        <span className="text-sm font-jakarta font-semibold text-blue-600">
                          View Shop
                        </span>
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-jakarta font-semibold transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-1 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-jakarta font-semibold transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border-2 border-slate-300 text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-jakarta font-semibold transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
