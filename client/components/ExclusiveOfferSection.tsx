import { Zap, Award, TrendingUp } from "lucide-react";

export default function ExclusiveOfferSection() {
  return (
    <section className="w-full py-12 md:py-16 relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Product Image */}
          <div className="relative order-2 lg:order-1">
            {/* Accent Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-600/10 rounded-3xl"></div>

            <div className="relative p-8 md:p-12">
              <img
                src="https://images.pexels.com/photos/12097160/pexels-photo-12097160.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Female Athlete in Sports Activewear"
                className="w-full relative z-10 drop-shadow-2xl rounded-2xl"
              />

              {/* Performance Badge */}
              <div className="absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="font-jakarta font-bold text-slate-900 text-sm">
                    Limited Stock
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
              <Award className="w-4 h-4" />
              <span className="font-jakarta font-semibold text-sm">
                Exclusive Drop
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h2 className="font-almarai font-bold text-5xl md:text-6xl lg:text-7xl text-slate-900 leading-tight mb-4">
                Limited Time
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
                  Athletic Exclusive
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="font-jakarta text-lg text-slate-600 leading-relaxed max-w-lg">
              Premium performance gear designed for champions. Get up to <span className="font-bold text-orange-600">40% off</span> on our latest collection of professional-grade athletic equipment and apparel.
            </p>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="text-2xl font-almarai font-bold text-slate-900 mb-1">
                  50K+
                </div>
                <p className="font-jakarta text-xs text-slate-600">
                  Athletes Trust
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="text-2xl font-almarai font-bold text-slate-900 mb-1">
                  98%
                </div>
                <p className="font-jakarta text-xs text-slate-600">
                  Satisfaction
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="text-2xl font-almarai font-bold text-slate-900 mb-1">
                  5★
                </div>
                <p className="font-jakarta text-xs text-slate-600">
                  Rated
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="space-y-4">
              <p className="font-jakarta font-semibold text-slate-900 text-sm uppercase tracking-wider">
                Offer Expires In
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "06", label: "Days", icon: "📅" },
                  { value: "18", label: "Hours", icon: "⏰" },
                  { value: "48", label: "Minutes", icon: "⏱️" },
                ].map((time, index) => (
                  <div
                    key={index}
                    className="flex-1 min-w-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-center border border-slate-700 hover:border-orange-500 transition-colors"
                  >
                    <div className="text-2xl md:text-3xl font-almarai font-bold text-white mb-1">
                      {time.value}
                    </div>
                    <p className="font-jakarta font-medium text-slate-300 text-xs">
                      {time.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-jakarta font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5" />
                Shop Now
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-jakarta font-bold text-lg hover:bg-slate-900 hover:text-white transition-all duration-300">
                <TrendingUp className="w-5 h-5" />
                Learn More
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-jakarta text-sm text-slate-600">
                  Free Shipping Worldwide
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-jakarta text-sm text-slate-600">
                  30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
