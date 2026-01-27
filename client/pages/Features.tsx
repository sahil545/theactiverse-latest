import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Zap, Heart } from "lucide-react";
import {
  Product,
  Vendor,
  getProducts,
  getVendors,
  getProductImageUrl,
} from "@/lib/api";
import ProductRatingBadge from "@/components/ProductRatingBadge";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  readTime: number;
}

const featuredBlogs: BlogPost[] = [
  {
    id: 1,
    slug: "activewear-guide-2024",
    title: "Complete Guide to Activewear in 2024",
    excerpt:
      "Discover the latest trends in activewear and how to choose the perfect pieces for your fitness journey.",
    author: "Sarah Johnson",
    date: "January 15, 2024",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    readTime: 8,
  },
  {
    id: 2,
    slug: "fitness-tips-beginners",
    title: "Fitness Tips for Beginners: Getting Started Right",
    excerpt:
      "Start your fitness journey with these proven tips and strategies from professional trainers.",
    author: "Mike Chen",
    date: "January 10, 2024",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    readTime: 6,
  },
  {
    id: 3,
    slug: "sustainable-fashion",
    title: "Sustainable Fashion: Why It Matters",
    excerpt:
      "Learn about the importance of sustainable fashion and how to make eco-friendly choices.",
    author: "Emma Davis",
    date: "January 5, 2024",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    readTime: 7,
  },
];

export default function Features() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [products, vendorsList] = await Promise.all([
      getProducts(),
      getVendors(),
    ]);

    setAllProducts(products);
    setVendors(vendorsList);

    // Get top 8 products for featured section
    const featured = products.slice(0, 8);
    setFeaturedProducts(featured);

    setLoading(false);
  };

  // Get top rated products (by rating count)
  const topRatedProducts = allProducts
    .sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
    .slice(0, 4);

  // Get trending products (highest prices as trending indicator)
  const trendingProducts = allProducts
    .sort((a, b) => b.product_price - a.product_price)
    .slice(0, 4);

  const features = [
    {
      icon: TrendingUp,
      title: "Premium Collection",
      description: "Hand-picked activewear from top brands worldwide",
    },
    {
      icon: Zap,
      title: "Lightning Fast Shipping",
      description: "Free shipping on orders over $50 with express delivery",
    },
    {
      icon: Heart,
      title: "Quality Guaranteed",
      description: "100% authentic products with satisfaction guarantee",
    },
    {
      icon: Star,
      title: "Expert Curation",
      description: "Selected by fitness and fashion experts",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Banner with Highlights Image */}
        <section className="w-full relative overflow-hidden">
          <div
            className="w-full h-96 md:h-[500px] lg:h-[600px] bg-cover bg-center relative"
            style={{
              backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F9c433034c4a24db1918d9c9892cfb057%2F3cff0c49e2c641a09e0682af3d39fefd?format=webp&width=800')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl">
                  <h1 className="font-mirza font-bold text-[48px] md:text-[64px] lg:text-[72px] leading-tight mb-4 text-white">
                    Discover What Makes Us Different
                  </h1>
                  <p className="font-jakarta font-medium text-[16px] md:text-[18px] text-white/90 mb-8 leading-relaxed">
                    Explore our curated collection of premium activewear and
                    fashion designed for your lifestyle.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-poppins font-bold text-[16px] rounded-[10px] hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
                  >
                    Start Shopping
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-tight mb-4 text-[#1a1a1a]">
                Why Choose The Activerse
              </h2>
              <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E] max-w-2xl mx-auto">
                We're committed to bringing you the best activewear and fashion
                experience with unmatched quality and service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-[15px] border border-[#E0E0E0] bg-white hover:shadow-lg hover:border-brand-blue transition-all duration-300 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 mb-4">
                      <Icon className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="font-jakarta font-bold text-[18px] mb-2 text-[#1a1a1a]">
                      {feature.title}
                    </h3>
                    <p className="font-jakarta font-medium text-[14px] text-[#7E7E7E]">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        {!loading && featuredProducts.length > 0 && (
          <section className="w-full py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-tight mb-2 text-[#1a1a1a]">
                    Featured Products
                  </h2>
                  <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                    Bestsellers and customer favorites
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="hidden md:flex items-center gap-2 text-brand-blue hover:text-brand-green font-jakarta font-bold text-[16px] transition-colors"
                >
                  View All
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.product_id}
                    to={`/product/${product.product_id}`}
                    className="group"
                  >
                    <div className="relative bg-[#F5F5F5] rounded-[12px] overflow-hidden mb-4 h-64 md:h-72">
                      <img
                        src={getProductImageUrl(product.product_thumbnail)}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.product_status === "active" && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full font-jakarta font-bold text-[12px]">
                          Hot
                        </div>
                      )}
                    </div>
                    <h3 className="font-jakarta font-bold text-[14px] md:text-[16px] text-[#1a1a1a] line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                      {product.product_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-jakarta font-bold text-[16px] md:text-[18px] text-[#1a1a1a]">
                        ${product.product_price.toFixed(2)}
                      </p>
                      <ProductRatingBadge
                        product_id={product.product_id}
                        ratingCount={product.rating_count || 0}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Top Rated Products Section */}
        {!loading && topRatedProducts.length > 0 && (
          <section className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-tight mb-2 text-[#1a1a1a]">
                    Top Rated
                  </h2>
                  <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                    Customer favorites with exceptional reviews
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topRatedProducts.map((product) => (
                  <Link
                    key={product.product_id}
                    to={`/product/${product.product_id}`}
                    className="group"
                  >
                    <div className="relative bg-[#F5F5F5] rounded-[12px] overflow-hidden mb-4 h-64 md:h-72">
                      <img
                        src={getProductImageUrl(product.product_thumbnail)}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-jakarta font-bold text-[12px] text-[#1a1a1a]">
                          {product.average_rating || 4.5}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-jakarta font-bold text-[14px] md:text-[16px] text-[#1a1a1a] line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                      {product.product_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-jakarta font-bold text-[16px] md:text-[18px] text-[#1a1a1a]">
                        ${product.product_price.toFixed(2)}
                      </p>
                      <ProductRatingBadge
                        product_id={product.product_id}
                        ratingCount={product.rating_count || 0}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Blog Section */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-tight mb-2 text-[#1a1a1a]">
                  Latest Articles
                </h2>
                <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                  Insights and tips from our experts
                </p>
              </div>
              <Link
                to="/blogs"
                className="hidden md:flex items-center gap-2 text-brand-blue hover:text-brand-green font-jakarta font-bold text-[16px] transition-colors"
              >
                Read All
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="group block rounded-[15px] overflow-hidden border border-[#E0E0E0] hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 bg-[#F5F5F5] overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-jakarta font-bold text-[#7E7E7E] uppercase">
                        {blog.date}
                      </span>
                      <span className="text-xs font-jakarta font-bold text-brand-blue">
                        {blog.readTime} min read
                      </span>
                    </div>
                    <h3 className="font-jakarta font-bold text-[16px] md:text-[18px] text-[#1a1a1a] line-clamp-2 mb-3 group-hover:text-brand-blue transition-colors">
                      {blog.title}
                    </h3>
                    <p className="font-jakarta font-medium text-[14px] text-[#7E7E7E] line-clamp-2 mb-4">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#E0E0E0]">
                      <span className="font-jakarta font-medium text-[12px] text-[#7E7E7E]">
                        By {blog.author}
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Products Section */}
        {!loading && trendingProducts.length > 0 && (
          <section className="w-full py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-tight mb-2 text-[#1a1a1a]">
                    Trending Now
                  </h2>
                  <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                    Hot picks that everyone is talking about
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingProducts.map((product) => (
                  <Link
                    key={product.product_id}
                    to={`/product/${product.product_id}`}
                    className="group"
                  >
                    <div className="relative bg-[#F5F5F5] rounded-[12px] overflow-hidden mb-4 h-64 md:h-72">
                      <img
                        src={getProductImageUrl(product.product_thumbnail)}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full font-jakarta font-bold text-[12px] animate-pulse">
                        Trending
                      </div>
                    </div>
                    <h3 className="font-jakarta font-bold text-[14px] md:text-[16px] text-[#1a1a1a] line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                      {product.product_name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-jakarta font-bold text-[16px] md:text-[18px] text-[#1a1a1a]">
                        ${product.product_price.toFixed(2)}
                      </p>
                      <ProductRatingBadge
                        product_id={product.product_id}
                        ratingCount={product.rating_count || 0}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-brand-blue via-blue-600 to-brand-blue relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="font-mirza font-bold text-[40px] md:text-[56px] leading-tight mb-4 text-white">
              Ready to Elevate Your Activewear?
            </h2>
            <p className="font-jakarta font-medium text-[16px] md:text-[18px] text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of customers who trust us for quality, style, and
              exceptional service.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-blue font-poppins font-bold text-[16px] rounded-[10px] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Explore Full Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
