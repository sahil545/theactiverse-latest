import { TrendingUp, Globe, RotateCcw, Headphones, CreditCard } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Worldwide Shipping",
      description: "Fast and reliable delivery to over 200 countries with real-time tracking and insurance coverage.",
      stat: "200+",
      statLabel: "Countries",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Hassle-free returns within 30 days. No questions asked. Full refunds or exchanges available.",
      stat: "10",
      statLabel: "Day Return",
    },
    {
      icon: Headphones,
      title: "Online Support",
      description: "24/7 customer support via chat, email, and phone. Our team is always ready to help.",
      stat: "24/7",
      statLabel: "Support",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "Multiple payment options including credit cards.",
      stat: "10+",
      statLabel: "Options",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-blue-600 to-blue-800 py-12 md:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-200" />
            <span className="font-jakarta font-semibold text-blue-200 text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
          </div>
          <h2 className="font-almarai font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
            Why We're Different
          </h2>
          <p className="font-jakarta text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Industry-leading features and services designed to give you peace of mind
            with every purchase
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:border-white/40"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center mb-6 group-hover:from-white/40 group-hover:to-white/20 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Stat - Optional Visual Interest */}
              <div className="mb-6 pb-6 border-b border-white/20">
                <p className="font-almarai font-bold text-3xl text-white">
                  {feature.stat}
                </p>
                <p className="font-jakarta text-sm text-blue-100">
                  {feature.statLabel}
                </p>
              </div>

              {/* Title */}
              <h3 className="font-jakarta font-bold text-white text-xl mb-4 group-hover:text-blue-100 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-jakarta text-blue-100 text-base leading-relaxed">
                {feature.description}
              </p>

              {/* Accent line on hover */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white to-transparent rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="font-jakarta text-blue-100 mb-8 text-lg">
            Ready to experience the difference?
          </p>
          <button className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-blue-600 font-jakarta font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
            Start Shopping Now
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
