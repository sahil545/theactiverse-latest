import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import VendorSection from "@/components/VendorSection";
import CategorySection from "@/components/CategorySection";
import CategoryWithProductsSection from "@/components/CategoryWithProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ExclusiveOfferSection from "@/components/ExclusiveOfferSection";
import ResourcesSection from "@/components/ResourcesSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategorySection />
      <CategoryWithProductsSection categoryId={10} />
          {/* <CategoryWithProductsSection categoryId={8} /> */}
      <CategoryWithProductsSection categoryId={6} />
      
      <VendorSection />
      <TestimonialsSection />
      <ExclusiveOfferSection />
      <ResourcesSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
