import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    titleLight: "Empowering",
    titleBold: "Active Lifestyles",
     image: "https://admin.theactiverse.com/public/backend_assets/images/banner1.jpg",
  },
  {
    titleLight: "Train",
    titleBold: "Like a Pro",
     image: "https://admin.theactiverse.com/public/backend_assets/images/banner2.jpg",
  },
  {
    titleLight: "Push",
    titleBold: "Your Limits",
    image: "https://admin.theactiverse.com/public/backend_assets/images/banner3.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  return (
    <section className="relative w-full h-[600px] md:h-[600px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0  duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
         <img
            src={slide.image}
            alt={`${slide.titleBold} background`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-3xl animate-fadeInUp">
              <h1 className="font-poppins text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-[98px] leading-tight lg:leading-[118px] uppercase mb-6">
                <span className="font-light">{slide.titleLight} </span>
                <span className="font-bold">{slide.titleBold}</span>
              </h1>
<Link
  to="/shop"
  style={{ width: "250px" }}
  className="flex items-center justify-center gap-3 bg-black text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[17px] font-bold text-[18px] sm:text-[23px] hover:bg-gray-900 transition"
>
  Shop Now
  <ArrowRight className="w-6 h-6" />
</Link>
            </div>
          </div>
        </div>
      ))}

      {/* LEFT Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition"
      >
        <ArrowLeft className="text-white w-6 h-6" />
      </button>

      {/* RIGHT Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center transition"
      >
        <ArrowRight className="text-white w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
