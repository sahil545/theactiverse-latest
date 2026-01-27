import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Share2 } from "lucide-react";
import { toast } from "sonner";

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

const allBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "activewear-guide-2024",
    title: "Complete Guide to Activewear in 2024",
    excerpt:
      "Discover the latest trends in activewear and how to choose the perfect pieces for your fitness journey.",
    content: `
      <p>Activewear has become more than just gym clothes. It's a lifestyle choice that reflects your commitment to health and wellness. In this comprehensive guide, we'll explore the latest trends, materials, and styling tips to help you build the perfect activewear wardrobe.</p>

      <h2>The Evolution of Activewear</h2>
      <p>Over the past decade, activewear has transformed from basic athletic gear to a fashion statement. Today's activewear combines functionality with style, allowing you to look great whether you're heading to the gym or running errands around town.</p>

      <h2>Key Trends for 2024</h2>
      <ul>
        <li>Oversized Silhouettes: Comfort meets style with loose-fitting athletic wear</li>
        <li>Sustainable Materials: Eco-friendly fabrics are becoming the norm</li>
        <li>Bold Colors: Vibrant hues and color blocking are having a moment</li>
        <li>Elevated Details: Technical fabrics with sophisticated design elements</li>
      </ul>

      <h2>Choosing the Right Fabric</h2>
      <p>The fabric you choose can make or break your activewear experience. Look for moisture-wicking materials that keep you dry during intense workouts, and consider the climate where you'll be wearing them.</p>

      <h2>Building Your Activewear Wardrobe</h2>
      <p>Start with basics: a few pairs of high-quality leggings, sports bras, and t-shirts. Add layering pieces like hoodies and jackets, then accessorize with hats, gloves, and socks. Don't forget proper footwear for different activities.</p>

      <h2>Styling Tips</h2>
      <p>Mix and match your activewear with casual pieces to create looks that work both in and out of the gym. Pair your favorite leggings with an oversized sweater, or wear your sports bra with a cropped jacket for a trendy look.</p>
    `,
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
    content: `
      <p>Starting a fitness journey can be intimidating, but with the right approach and mindset, you can achieve your goals. This guide will help you get started on the right foot.</p>

      <h2>Setting Realistic Goals</h2>
      <p>Before you start, define what fitness means to you. Whether it's losing weight, building muscle, or improving endurance, having clear goals will keep you motivated.</p>

      <h2>Finding the Right Activity</h2>
      <p>Not everyone loves the gym. Try different activities until you find something you enjoy. This could be running, cycling, swimming, yoga, or team sports.</p>

      <h2>Consistency is Key</h2>
      <p>Start with 3-4 days a week and gradually increase. Consistency matters more than intensity when you're just starting out.</p>

      <h2>Proper Nutrition</h2>
      <p>You can't out-exercise a bad diet. Focus on eating whole foods, staying hydrated, and getting enough protein to support your fitness goals.</p>

      <h2>Rest and Recovery</h2>
      <p>Don't neglect rest days. Your muscles grow during recovery, not during the workout itself. Aim for 7-9 hours of sleep per night.</p>
    `,
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
    content: `
      <p>The fashion industry has a significant impact on the environment. By making conscious choices, you can be part of the solution.</p>

      <h2>The Environmental Impact of Fashion</h2>
      <p>The fashion industry is the second largest consumer of water and a significant source of pollution. Fast fashion has made clothes cheaper and more accessible, but at a high environmental cost.</p>

      <h2>Why Sustainable Fashion Matters</h2>
      <p>Sustainable fashion reduces waste, conserves resources, and supports fair labor practices. When you choose sustainable brands, you're investing in your future and the planet's future.</p>

      <h2>How to Shop Sustainably</h2>
      <ul>
        <li>Buy less, choose well: Focus on quality over quantity</li>
        <li>Support sustainable brands: Look for certifications and transparency</li>
        <li>Thrift and vintage: Give new life to pre-owned items</li>
        <li>Care for your clothes: Proper maintenance extends their lifespan</li>
      </ul>

      <h2>Making the Transition</h2>
      <p>You don't have to change everything overnight. Start by being more intentional with your purchases and gradually build a more sustainable wardrobe.</p>
    `,
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
    content: `
      <p>With the rise of home workouts, investing in quality equipment is essential. Here's what you need to get started.</p>

      <h2>Must-Have Equipment</h2>
      <p>Start with the basics: dumbbells, a yoga mat, and a resistance band. These versatile tools allow you to do hundreds of exercises with minimal investment.</p>

      <h2>Nice-to-Have Equipment</h2>
      <p>As you progress, consider adding: an exercise bench, kettlebells, a pull-up bar, and a foam roller for recovery.</p>

      <h2>Space Considerations</h2>
      <p>You don't need much space. A corner of a bedroom or a garage is enough to set up an effective home gym.</p>

      <h2>Budget-Friendly Tips</h2>
      <p>Start small and add equipment gradually as your fitness level increases. Look for sales and consider used equipment to save money.</p>
    `,
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
    content: `
      <p>Nutrition plays a crucial role in your fitness success. The right diet can enhance performance, speed up recovery, and help you achieve your goals.</p>

      <h2>Pre-Workout Nutrition</h2>
      <p>Eat a balanced meal 2-3 hours before working out, or a light snack 30 minutes before. Include carbs for energy and protein for muscle support.</p>

      <h2>Post-Workout Nutrition</h2>
      <p>Within 30-60 minutes after working out, eat protein and carbs to help with recovery and muscle growth. A protein shake or a meal with chicken and rice works great.</p>

      <h2>Macro Nutrients</h2>
      <p>Balance your diet with appropriate amounts of carbohydrates, proteins, and fats. The exact ratio depends on your fitness goals.</p>

      <h2>Staying Hydrated</h2>
      <p>Drink water before, during, and after your workout. Proper hydration improves performance and aids recovery.</p>
    `,
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
    content: `
      <p>We're excited to announce our upcoming summer collection. Here's a sneak peek at what's coming.</p>

      <h2>Design Inspiration</h2>
      <p>This season's collection is inspired by vibrant beach vibes and athletic performance. We've combined breathable fabrics with bold designs to create pieces you'll love.</p>

      <h2>New Features</h2>
      <p>Our summer collection includes new moisture-wicking technology, enhanced ventilation, and innovative color combinations.</p>

      <h2>Sustainability Focus</h2>
      <p>We're committed to sustainability. Our summer collection uses 80% recycled materials and eco-friendly production methods.</p>

      <h2>When's It Available?</h2>
      <p>The collection launches this spring. Sign up for early access and get 20% off your first purchase!</p>
    `,
    author: "Rachel Martinez",
    date: "December 15, 2023",
    category: "Fashion",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/5f3c78acce791f5443ba6ae9b87178c55ff39f2c?width=808",
    readTime: 5,
  },
];

export default function Blog() {
  const { slug } = useParams<{ slug: string }>();
  const post = allBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-mirza font-bold text-[48px] mb-4">
              Post not found
            </h1>
            <Link to="/blogs" className="text-[#032088] hover:underline">
              Back to blogs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const relatedPosts = allBlogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Blog Header */}
        <section className="w-full py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-[#032088] font-jakarta font-semibold text-[14px] mb-6 hover:gap-3 transition-all"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to blogs
            </Link>

            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-[#032088] text-white rounded-full font-jakarta font-semibold text-[14px] mb-6">
                {post.category}
              </span>
              <h1 className="font-mirza font-bold text-[42px] md:text-[54px] leading-[52px] md:leading-[64px] mb-6">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 pb-8 border-b">
              <div className="flex items-center gap-2 text-[#7E7E7E]">
                <User className="w-4 h-4" />
                <span className="font-jakarta font-medium text-[14px]">
                  {post.author}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#7E7E7E]">
                <Calendar className="w-4 h-4" />
                <span className="font-jakarta font-medium text-[14px]">
                  {post.date}
                </span>
              </div>
              <span className="font-jakarta font-medium text-[14px] text-[#7E7E7E]">
                {post.readTime} min read
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 text-[#032088] font-jakarta font-semibold text-[14px] hover:opacity-70 transition"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="w-full py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="w-full h-[300px] md:h-[500px] rounded-[20px] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="w-full py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none font-jakarta">
              <div
                className="space-y-6 text-[#333]"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(
                      /<p>/g,
                      '<p class="font-jakarta font-medium text-[16px] leading-[28px] text-[#7E7E7E]">',
                    )
                    .replace(
                      /<h2>/g,
                      '<h2 class="font-mirza font-bold text-[28px] leading-[36px] mt-8 mb-4">',
                    )
                    .replace(
                      /<ul>/g,
                      '<ul class="list-disc list-inside space-y-3">',
                    )
                    .replace(
                      /<li>/g,
                      '<li class="font-jakarta font-medium text-[16px] leading-[28px] text-[#7E7E7E]">',
                    ),
                }}
              />
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="w-full py-16 md:py-24 bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-[50px] md:leading-[58px] mb-12">
                Related Articles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group flex flex-col h-full bg-white rounded-[15px] overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <span className="inline-block px-3 py-1 bg-[#032088]/10 text-[#032088] rounded-full font-jakarta font-semibold text-[12px] mb-3 w-fit">
                        {relatedPost.category}
                      </span>

                      <h3 className="font-mirza font-bold text-[18px] leading-[26px] mb-3 group-hover:text-[#032088] transition">
                        {relatedPost.title}
                      </h3>

                      <p className="font-jakarta font-medium text-[14px] text-[#7E7E7E] mb-4 flex-1">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center gap-2 text-[#032088] font-jakarta font-semibold text-[14px] group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
