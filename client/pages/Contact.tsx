import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')`,
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#032088]/75 via-[#032088]/65 to-[#7DC3EB]/70"></div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="font-mirza font-bold text-[48px] md:text-[64px] leading-[58px] md:leading-[78px] mb-4 text-white">
                Get in Touch
              </h1>
              <p className="font-jakarta font-medium text-[18px] text-white/90 max-w-2xl mx-auto">
                Have a question or feedback? We'd love to hear from you. Fill
                out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-[50px] md:leading-[58px] mb-8">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block font-jakarta font-semibold text-[16px] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[16px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-jakarta font-semibold text-[16px] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[16px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-jakarta font-semibold text-[16px] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-5 py-4 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[16px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block font-jakarta font-semibold text-[16px] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full px-5 py-4 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[16px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-jakarta font-semibold text-[16px] mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="w-full px-5 py-4 rounded-[10px] border border-[#E0E0E0] font-jakarta font-medium text-[16px] focus:outline-none focus:ring-2 focus:ring-[#032088] transition resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#032088] text-white font-jakarta font-bold text-[18px] rounded-[10px] hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                {/* Contact Info Image */}
                <div className="w-full h-[300px] md:h-[400px] rounded-[15px] overflow-hidden mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
                    alt="Contact Us"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="font-mirza font-bold text-[40px] md:text-[48px] leading-[50px] md:leading-[58px] mb-8">
                      Contact Information
                    </h2>
                  </div>

                  {/* Email */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#032088]/10 rounded-[10px] flex items-center justify-center">
                      <Mail className="w-8 h-8 text-[#032088]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-[20px] mb-2">
                      Email
                    </h3>
                    <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                      info@ytheactiverse.com
                    </p>
                    
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#032088]/10 rounded-[10px] flex items-center justify-center">
                      <Phone className="w-8 h-8 text-[#032088]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-[20px] mb-2">
                      Phone
                    </h3>
                    <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                      561-281-2091
                    </p>
                   
                  </div>
                </div>

                

                {/* Business Hours */}
                  {/* <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#032088]/10 rounded-[10px] flex items-center justify-center">
                      <Clock className="w-8 h-8 text-[#032088]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-[20px] mb-2">
                      Business Hours
                    </h3>
                    <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>
      <Footer />
    </>
  );
}
