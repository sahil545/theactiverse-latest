import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "activewear-guide-2024",
    title: "Complete Guide to Activewear in 2024",
    excerpt:
      "Discover the latest trends in activewear and how to choose the perfect pieces for your fitness journey.",
    content: "Complete guide content...",
    author: "Sarah Johnson",
    date: "January 15, 2024",
    category: "Fashion",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/e56f332578268103b535949b6bbcf6273889237e?width=810",
    readTime: 8,
  },
  {
    id: 2,
    slug: "fitness-tips-beginners",
    title: "Fitness Tips for Beginners: Getting Started Right",
    excerpt:
      "Start your fitness journey with these proven tips and strategies from professional trainers.",
    content: "Fitness tips content...",
    author: "Mike Chen",
    date: "January 10, 2024",
    category: "Fitness",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/c2c9e11dc4555c8f4aac05da397470754e87d958?width=808",
    readTime: 6,
  },
  {
    id: 3,
    slug: "sustainable-fashion",
    title: "Sustainable Fashion: Why It Matters",
    excerpt:
      "Learn about the importance of sustainable fashion and how to make eco-friendly choices.",
    content: "Sustainable fashion content...",
    author: "Emma Davis",
    date: "January 5, 2024",
    category: "Sustainability",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/11aeeb5c9eb939a0f1e9724a2aa295e043f67e0b?width=820",
    readTime: 7,
  },
  {
    id: 4,
    slug: "gym-equipment-essentials",
    title: "Essential Gym Equipment for Home Workouts",
    excerpt:
      "Build the perfect home gym with our comprehensive guide to must-have equipment.",
    content: "Gym equipment content...",
    author: "James Wilson",
    date: "December 28, 2023",
    category: "Fitness",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/f766ece6e4fb68d21ef717a7b8d4ba9696520e5e?width=820",
    readTime: 9,
  },
  {
    id: 5,
    slug: "workout-nutrition",
    title: "Nutrition Guide for Optimal Performance",
    excerpt:
      "Maximize your workouts with the right nutrition. Complete guide to sports nutrition.",
    content: "Nutrition guide content...",
    author: "Lisa Anderson",
    date: "December 20, 2023",
    category: "Health",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/bf737f6f4fb469b042e3ea9308cc8b51c7a6f0b2?width=810",
    readTime: 8,
  },
  {
    id: 6,
    slug: "summer-collection-preview",
    title: "Summer Collection 2024: What's Coming Next",
    excerpt:
      "Get an exclusive preview of our upcoming summer collection with latest styles and trends.",
    content: "Summer collection content...",
    author: "Rachel Martinez",
    date: "December 15, 2023",
    category: "Fashion",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/5f3c78acce791f5443ba6ae9b87178c55ff39f2c?width=808",
    readTime: 5,
  },
];

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop')`,
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#032088]/75 via-[#032088]/65 to-[#7DC3EB]/70"></div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="font-mirza font-bold text-[48px] md:text-[64px] leading-[58px] md:leading-[78px] mb-4 text-white">
                Our Blog
              </h1>
              <p className="font-jakarta font-medium text-[18px] text-white/90 max-w-2xl mx-auto">
                Explore articles on fitness, fashion, health, and activewear
                trends to keep you informed and inspired.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full py-8 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="font-jakarta font-semibold text-[16px] text-[#7E7E7E]">
                Filter by:
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-jakarta font-semibold text-[14px] transition ${
                    selectedCategory === category
                      ? "bg-[#032088] text-white"
                      : "bg-gray-100 text-[#7E7E7E] hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-jakarta font-medium text-[18px] text-[#7E7E7E]">
                  No articles found matching your search.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {filteredPosts.length > 0 && (
                  <div className="mb-16">
                    <Link
                      to={`/blog/${filteredPosts[0].slug}`}
                      className="group block"
                    >
                      <div className="relative w-full h-[300px] md:h-[400px] rounded-[20px] overflow-hidden mb-6">
                        <img
                          src={filteredPosts[0].image}
                          alt={filteredPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                          <span className="inline-block px-4 py-2 bg-[#032088] text-white rounded-full font-jakarta font-semibold text-[14px] mb-4">
                            {filteredPosts[0].category}
                          </span>
                          <h2 className="font-mirza font-bold text-[32px] md:text-[44px] leading-[40px] md:leading-[54px] text-white group-hover:text-[#EBD96B] transition">
                            {filteredPosts[0].title}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-[#7E7E7E]">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-jakarta font-medium text-[14px]">
                            {filteredPosts[0].author}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-jakarta font-medium text-[14px]">
                            {filteredPosts[0].date}
                          </span>
                        </div>
                        <span className="font-jakarta font-medium text-[14px]">
                          {filteredPosts[0].readTime} min read
                        </span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Other Posts Grid */}
                {filteredPosts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.slice(1).map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col h-full"
                      >
                        <div className="relative w-full aspect-[4/3] rounded-[15px] overflow-hidden mb-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 flex flex-col">
                          <span className="inline-block px-3 py-1 bg-[#032088]/10 text-[#032088] rounded-full font-jakarta font-semibold text-[12px] mb-3 w-fit">
                            {post.category}
                          </span>

                          <h3 className="font-mirza font-bold text-[20px] leading-[28px] mb-3 group-hover:text-[#032088] transition">
                            {post.title}
                          </h3>

                          <p className="font-jakarta font-medium text-[15px] text-[#7E7E7E] mb-4 flex-1">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-[#7E7E7E] text-[13px] mb-4">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{post.date}</span>
                            </div>
                            <span>{post.readTime} min</span>
                          </div>

                          <div className="flex items-center gap-2 text-[#032088] font-jakarta font-semibold text-[14px] group-hover:gap-3 transition-all">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="w-full py-16 md:py-24 bg-[#032088] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-[50px] md:leading-[58px] mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="font-jakarta font-medium text-[16px] text-white/80 mb-8">
              Get the latest articles, fitness tips, and fashion trends
              delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-[10px] border-0 font-jakarta font-medium text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#EBD96B]"
              />
              <button className="px-6 py-4 bg-[#EBD96B] text-[#032088] font-jakarta font-bold text-[16px] rounded-[10px] hover:bg-white transition">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
