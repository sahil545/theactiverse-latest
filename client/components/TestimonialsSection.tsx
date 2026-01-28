import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Michael R.",
      role: "Fitness Coach",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/64d23a98366c7d7860f5314be7abad0c0a9baee3?width=206",
      quote:
        "The Activerse delivers exactly what activewear should—comfort, flexibility, and style. I use it for training sessions and daily wear.",
      rating: 5,
    },
    {
      name: "Jessica L.",
      role: "Fashion Influencer",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/5886d14b082fd177627cea6bf47c0ce213bba8a4?width=206",
      quote:
        "I’m obsessed with The Activerse! The quality is premium, the fit is flattering, and it transitions perfectly from gym to street style.",
      rating: 5,
    },
    {
      name: "Daniel W.",
      role: "Marathon Runner",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/47519c9629f63a5c58c0319fba8aaf2077143c39?width=206",
      quote:
        "Exceptional performance wear. The Activerse clothing holds up during long runs and still looks brand new after multiple washes.",
      rating: 5,
    },
  ];


  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative inline-block">
            <h2 className="font-almarai font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-3 text-slate-900">
              What People Are Saying
            </h2>
            <svg
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-[106px] h-[29px]"
              viewBox="0 0 106 29"
              fill="none"
            >
              <path
                d="M47.871 3.30009C37.233 6.89723 12.7656 16.5818 0 26.5431C32.2939 30.9704 98.7054 32.5199 106 3.30009C95.7419 0.809765 69.7548 -2.67669 47.871 3.30009Z"
                fill="#EBD96B"
              />
            </svg>
          </div>
          <p className="font-jakarta text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
            Hear from our satisfied customers about their experience with our products
            and services
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
            >
              {/* Accent bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200"></div>

              {/* Card Content */}
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-6 opacity-40 group-hover:opacity-60 transition-opacity">
                  <svg
                    className="w-10 h-10 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5C5.37 0 3 2.75 3 4c0 1 0 1 1 1s1 0 1-1c0-1 .229-2 1-2 1 0 4 1.057 4 5v6.5c0 4-2.5 7-4.5 7S2 21 3 21z" />
                  </svg>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="font-jakarta font-medium text-slate-700 text-base leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </blockquote>

                {/* Divider */}
                <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full mb-8"></div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-yellow-100"
                  />
                  <div>
                    <h3 className="font-jakarta font-bold text-slate-900 text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="font-jakarta font-medium text-slate-500 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA or Additional Info 
        <div className="mt-16 text-center">
          <p className="font-jakarta text-slate-600 mb-6">
            Join hundreds of happy customers
          </p>
          <button className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-slate-900 text-white font-jakarta font-semibold hover:bg-slate-800 transition-colors duration-300">
            See All Reviews
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>*/}
      </div>
    </section>
  );
}
