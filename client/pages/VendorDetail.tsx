import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Vendor,
  Product,
  getVendors,
  getProducts,
  getProductImageUrl,
} from "@/lib/api";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  Star,
  Shield,
  ExternalLink,
  Award,
  ShoppingCart,
} from "lucide-react";
import ColorSwatch from "@/components/ColorSwatch";
import ProductRatingBadge from "@/components/ProductRatingBadge";

export default function VendorDetail() {
  const { vendor_id } = useParams<{ vendor_id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [vendor_id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const vendorId = parseInt(vendor_id || "0", 10);

      const allVendors = await getVendors();
      setVendors(allVendors);
      const foundVendor = allVendors.find((v) => v.id === vendorId);
      setVendor(foundVendor || null);

      const allProducts = await getProducts();
      const vendorProducts = allProducts.filter(
        (p) => p.vendor_id === foundVendor?.vendor_id,
      );
      setProducts(vendorProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load vendor details";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-orange-500 mb-4"></div>
          <p className="font-jakarta text-slate-600">Loading vendor details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="w-12 h-12 text-slate-300 mb-4" />
          <p className="font-jakarta text-xl text-slate-600 mb-2">
            {error ? "Failed to load vendor details" : "Vendor not found"}
          </p>
          {error && (
            <p className="font-jakarta text-sm text-slate-500 mb-6 text-center max-w-md">
              {error}
            </p>
          )}
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-jakarta font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-12 font-jakarta font-semibold group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Vendors
        </Link>

        {/* Vendor Hero Section */}
        <div className="relative mb-16 md:mb-24 overflow-hidden rounded-3xl group">
          {/* Background Image */}
          <div className="absolute inset-0 -z-10">
            {vendor.photo ? (
              <img
                src={vendor.photo}
                alt={vendor.shop_name || vendor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/75 -z-10"></div>

          <div className="relative pt-4 pb-4 md:pt-6 md:pb-6 px-6 md:px-12 flex items-center">
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Vendor Logo/Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 bg-gradient-to-br from-orange-400 to-blue-600 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center flex-col overflow-hidden">
                    {vendor.photo ? (
                      <img
                        src={vendor.photo}
                        alt={vendor.shop_name || vendor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl md:text-7xl font-almarai font-bold text-white">
                        {(vendor.shop_name || vendor.name).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0 text-black md:text-left text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-almarai font-bold mb-4 break-words leading-tight">
                    {vendor.shop_name || vendor.name}
                  </h1>
                  <p className="text-base md:text-lg font-jakarta mb-6 font-semibold text-slate-700 hidden">
                    Operated by <span className="text-black font-bold">{vendor.name}</span>
                  </p>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                      <Award className="w-4 h-4" />
                      <span className="font-jakarta font-bold text-sm">
                        Trusted Seller
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                      <Star className="w-4 h-4 fill-blue-300" />
                      <span className="font-jakarta font-bold text-sm">
                        Premium Vendor
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Shield,
              label: "Status",
              value: "Active Vendor",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Package,
              label: "Products",
              value: products.length.toString(),
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Calendar,
              label: "Member Since",
              value: new Date(vendor.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              }),
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Star,
              label: "Rating",
              value: "Excellent",
              color: "from-blue-500 to-blue-600",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-jakarta text-sm text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="font-almarai font-bold text-2xl text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>


        {/* Products Section */}
        <div>
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-jakarta font-semibold text-sm mb-4">
              <Package className="w-4 h-4" />
              Our Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-almarai font-bold text-slate-900 mb-4">
              Featured Products
            </h2>
            <p className="font-jakarta text-lg text-slate-600">
              Explore <span className="font-bold text-slate-900">{products.length}</span> available{" "}
              {products.length === 1 ? "product" : "products"} from{" "}
              <span className="font-bold text-slate-900">{vendor.shop_name || vendor.name}</span>
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-dashed border-slate-300 p-16 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <p className="font-jakarta text-xl text-slate-600">
                No products available from this vendor yet.
              </p>
              <p className="font-jakarta text-slate-500 mt-2">
                Check back soon for new additions!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {products.map((product) => (
                <Link
                  key={product.product_id}
                  to={`/product/${product.product_id}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="bg-slate-100 aspect-[3/4] overflow-hidden relative flex items-center justify-center flex-shrink-0">
                    <img
                      src={getProductImageUrl(product.product_thumbnail)}
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/200?text=No+Image";
                      }}
                    />
                    {/* Stock Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-jakarta font-bold text-white ${
                      product.product_quantity > 0
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}>
                      {product.product_quantity > 0
                        ? `In Stock`
                        : "Out of Stock"}
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1 mb-3">
                      <h3 className="font-jakarta font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm">
                        {product.product_name}
                      </h3>
                      <div className="mb-2">
                        <ProductRatingBadge productId={product.product_id} compact />
                      </div>
                      <p className="text-xs font-jakarta text-slate-600 line-clamp-2">
                        {product.product_short_description}
                      </p>

                      {/* Color Swatches */}
                      {product.product_colors && (
                        <div className="mt-2">
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
                        <div className="mt-2">
                          <div className="flex gap-1 flex-wrap">
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

                    {/* Price Section */}
                    <div className="border-t border-slate-200 pt-3 mt-auto">
                      <div className="flex justify-between items-center">
                        <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1">
                          <p className="text-xs font-jakarta text-slate-500 mb-0.5 uppercase tracking-wide">
                            Price
                          </p>
                          <p className="text-lg font-almarai font-bold text-slate-700">
                            ${product.product_price.toLocaleString("en-US")}
                          </p>
                        </div>
                        <button className="p-2 rounded-lg bg-orange-100 text-orange-600 opacity-0 group-hover:opacity-100 transition-all group-hover:bg-orange-600 group-hover:text-white flex-shrink-0">
                          <Package className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 border border-slate-700 mt-16 mb-16">
          <h2 className="font-almarai font-bold text-3xl text-white mb-8">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-1">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-jakarta text-blue-200 font-semibold mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${vendor.email}`}
                  className="text-white hover:text-blue-300 font-jakarta font-medium break-all flex items-center gap-2 group"
                >
                  {vendor.email}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Phone */}
            {vendor.phone_number && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-jakarta text-blue-200 font-semibold mb-2">
                    Phone
                  </p>
                  <a
                    href={`tel:${vendor.phone_number}`}
                    className="text-white hover:text-blue-300 font-jakarta font-medium flex items-center gap-2 group"
                  >
                    {vendor.phone_number}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            )}

            {/* Location */}
            {vendor.address && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-jakarta text-blue-200 font-semibold mb-2">
                    Location
                  </p>
                  <p className="text-white font-jakarta font-medium">
                    {vendor.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Vendors Section */}
        <div className="mt-20 md:mt-28 pt-16 border-t border-slate-200">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-jakarta font-semibold text-sm mb-4">
              <ShoppingCart className="w-4 h-4" />
              More Sellers
            </div>
            <h2 className="text-4xl md:text-5xl font-almarai font-bold text-slate-900 mb-4">
              Explore More Vendors
            </h2>
            <p className="font-jakarta text-lg text-slate-600 max-w-2xl">
              Discover other trusted sellers offering quality products
            </p>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors
              .filter((v) => v.id !== vendor.id)
              .slice(0, 4)
              .map((otherVendor) => (
                <Link
                  key={otherVendor.id}
                  to={`/vendor/${otherVendor.id}`}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 h-80"
                >
                  {/* Background Image */}
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {otherVendor.photo ? (
                      <img
                        src={otherVendor.photo}
                        alt={otherVendor.shop_name || otherVendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <span className="text-7xl font-almarai font-bold text-white opacity-20">
                          {(otherVendor.shop_name || otherVendor.name)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-70 group-hover:opacity-80 transition-opacity"></div>

                    {/* Trust Badges - Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                        <Award className="w-4 h-4" />
                        <span className="font-jakarta font-bold text-xs">Trusted</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="w-4 h-4 fill-blue-300" />
                        <span className="font-jakarta font-bold text-xs">Premium</span>
                      </div>
                    </div>

                    {/* Content - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {/* Vendor Name */}
                      <h3 className="font-almarai font-bold text-2xl text-white mb-3 leading-tight line-clamp-2">
                        {otherVendor.shop_name || otherVendor.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm font-jakarta text-blue-100 mb-4 line-clamp-2">
                        {otherVendor.shop_description || "Quality products from trusted seller"}
                      </p>

                      {/* Active Indicator */}
                      <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-jakarta font-semibold text-slate-900 text-sm">
                          Active Seller
                        </span>
                      </div>

                      {/* View Shop Link - Visible on Hover */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 text-white font-jakarta font-semibold text-sm">
                          Visit Shop
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          {/* View All Vendors CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/vendors"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-jakarta font-bold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Vendors
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
