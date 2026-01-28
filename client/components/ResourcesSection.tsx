import { ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResourcesSection() {
  const articles = [
    {
      image: "https://admin.theactiverse.com/blog1.jpg",
      category: "Activewear Style",
      title: "Move Freely, Live Bold: The Activerse Way",
      description:
        "Explore how The Activerse designs premium t-shirts that combine comfort, performance, and everyday style for an active lifestyle.",
      author: "The Activerse Team",
      date: "March 18, 2024",
      readTime: "5 min read",
      featured: true,
    },
    {
      image: "https://admin.theactiverse.com/blog2.jpg",
      category: "Fashion & Performance",
      categories: ["Activewear", "Streetwear"],
      title: "Are You Ready to Elevate Your Everyday Wear?",
      description:
        "Discover how The Activerse blends performance fabrics with modern design to create clothing that fits both workouts and casual days.",
      author: "The Activerse Team",
      date: "March 18, 2024",
      readTime: "7 min read",
      featured: false,
    },
  ];


  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-yellow-400" />
            <span className="font-jakarta font-semibold text-yellow-600 text-sm uppercase tracking-wider">
              Knowledge Hub
            </span>
          </div>
          <h2 className="font-almarai font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 text-slate-900">
            More Resources
          </h2>
          <p className="font-jakarta text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            T-shirt Printing for Everyone. Get a headstart with free design templates
            you can customize in a few clicks.
          </p>
        </div>

        {/* Articles Grid - Featured + Regular */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {/* Featured Article */}
          {articles
            .filter((article) => article.featured)
            .map((article, index) => (
              <div
                key={index}
                className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer"
              >
                {/* Image Container with Overlay */}
                <div className="relative h-80 overflow-hidden bg-slate-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    <span className="font-jakarta font-bold text-sm text-slate-900">
                      Featured
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400 font-jakarta font-semibold text-sm text-slate-900">
                      {article.category}
                    </span>
                  </div>

                  {/* Content Overlay at Bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                    <h3 className="font-almarai font-bold text-2xl md:text-3xl leading-tight mb-3">
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">
                  <p className="font-jakarta text-slate-600 text-base leading-relaxed mb-6">
                    {article.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-jakarta text-sm text-slate-600">
                        by <span className="font-semibold text-slate-900">{article.author}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-jakarta text-sm text-slate-600">
                        {article.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="font-jakarta text-sm text-slate-600">
                        {article.readTime}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-jakarta font-semibold hover:bg-slate-800 transition-colors duration-300 group/btn">
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}

          {/* Regular Articles */}
          <div className="lg:col-span-1 space-y-6">
            {articles
              .filter((article) => !article.featured)
              .map((article, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 cursor-pointer h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.categories ? (
                        article.categories.map((cat, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 font-jakarta font-semibold text-xs text-yellow-700"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 font-jakarta font-semibold text-xs text-yellow-700">
                          {article.category}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-almarai font-bold text-lg leading-snug mb-4 flex-1 text-slate-900">
                      {article.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    {/* Read More Link */}
                    <button className="inline-flex items-center gap-2 text-yellow-600 font-jakarta font-semibold hover:text-yellow-700 transition-colors group/link">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-almarai font-bold text-2xl md:text-3xl text-white mb-4">
            Explore More Resources
          </h3>
          <p className="font-jakarta text-slate-300 text-base mb-8 max-w-xl mx-auto">
            Access our complete library of design guides, tutorials, and best practices to
            create stunning custom apparel.
          </p>
          <Link
  to="/blogs"
  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-yellow-400 text-slate-900 font-jakarta font-semibold hover:bg-yellow-300 transition-colors duration-300 group/cta"
>
  View All Articles
  <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
</Link>
        </div>
      </div>
    </section>
  );
}
