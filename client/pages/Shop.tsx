import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilters, { FilterState } from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";
import {
  Product,
  Vendor,
  SubCategory,
  getProducts,
  getVendors,
  getSubCategories,
  getProductImageUrl,
} from "@/lib/api";
import { Link } from "react-router-dom";
import ColorSwatch from "@/components/ColorSwatch";
import ProductRatingBadge from "@/components/ProductRatingBadge";

const PRODUCTS_PER_PAGE = 12;

export default function Shop() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    priceRange: [0, 5000],
    vendors: [],
    categories: [],
    ratings: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filters, allProducts]);

  const fetchData = async () => {
    setLoading(true);
    const [products, vendorsList, subCategoriesList] = await Promise.all([
      getProducts(),
      getVendors(),
      getSubCategories(),
    ]);

    setAllProducts(products);
    setVendors(vendorsList);
    setSubCategories(subCategoriesList);
    setFilteredProducts(products);

    // Set initial price range based on actual product prices
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map((p) => p.product_price));
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, maxPrice],
      }));
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search by product name
    if (filters.searchTerm) {
      filtered = filtered.filter((p) =>
        p.product_name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) =>
        p.product_price >= filters.priceRange[0] &&
        p.product_price <= filters.priceRange[1],
    );

    // Vendor filter
    if (filters.vendors.length > 0) {
      filtered = filtered.filter((p) => filters.vendors.includes(p.vendor_id));
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.sub_category_id),
      );
    }

    // Note: Rating filter is included but would require additional API data
    // For now, we'll keep the structure but note that ratings aren't in the current API response

    setFilteredProducts(filtered);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const maxPrice =
      allProducts.length > 0
        ? Math.max(...allProducts.map((p) => p.product_price))
        : 500;
    setFilters({
      searchTerm: "",
      priceRange: [0, maxPrice],
      vendors: [],
      categories: [],
      ratings: [],
    });
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const maxPrice = Math.max(
    ...allProducts.map((p) => p.product_price),
    filters.priceRange[1],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
          </p>
        </div>

        {/* Filters and Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            products={allProducts}
            vendors={vendors}
            subCategories={subCategories}
            onApplyFilters={handleApplyFilters}
            onReset={handleResetFilters}
            maxPrice={maxPrice}
          />

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">
                  No products found matching your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <Link
                      key={product.product_id}
                      to={`/product/${product.product_id}`}
                      className="group h-full"
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 h-full flex flex-col">
                        {/* Image Section */}
                        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
                          <img
                            src={getProductImageUrl(product.product_thumbnail)}
                            alt={product.product_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/300?text=No+Image";
                            }}
                          />

                          {/* Stock Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-jakarta font-bold shadow-lg ${
                              product.product_quantity > 0
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}>
                              {product.product_quantity > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </div>

                          {/* Overlay on Hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 md:p-6 flex-1 flex flex-col">
                          {/* Product Name */}
                          <h3 className="font-almarai font-bold text-base md:text-lg leading-tight text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.product_name}
                          </h3>

                          {/* Rating Badge */}
                          <div className="mb-3">
                            <ProductRatingBadge productId={product.product_id} compact />
                          </div>

                          {/* Description */}
                          <p className="text-sm font-jakarta text-slate-600 mb-4 line-clamp-2 flex-1">
                            {product.product_short_description}
                          </p>

                          {/* Color Swatches */}
                          {product.product_colors && (
                            <div className="mb-4 pb-4 border-b border-slate-200">
                              <p className="text-xs font-jakarta text-slate-500 font-semibold mb-2 uppercase tracking-wide">
                                Colors:
                              </p>
                              <ColorSwatch
                                colors={product.product_colors
                                  .split(",")
                                  .map((c) => c.trim())}
                                onColorSelect={() => {}}
                                size="sm"
                              />
                            </div>
                          )}

                          {/* Sizes */}
                          {product.product_sizes && (
                            <div className="mb-4 pb-4 border-b border-slate-200">
                              <p className="text-xs font-jakarta text-slate-500 font-semibold mb-2 uppercase tracking-wide">
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

                          {/* Price and CTA */}
                          <div className="space-y-3">
                            <div className="bg-slate-50 rounded-lg px-4 py-3 inline-block">
                              <p className="text-xs font-jakarta text-slate-500 uppercase tracking-wide mb-1">Price</p>
                              <p className="font-almarai font-bold text-2xl md:text-3xl text-slate-700">
                                ${product.product_price.toLocaleString("en-US")}
                              </p>
                            </div>
                            <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-jakarta font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group/btn">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
