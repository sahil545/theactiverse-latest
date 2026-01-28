import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Footer Links Section */}
      <div className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Company Info */}
            <div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F9c433034c4a24db1918d9c9892cfb057%2Ff519aab05c754ba7a8d5b80de58d057f?format=webp&width=800"
                alt="The Activerse"
                className="h-12 w-auto mb-6"
              />
              <div className="space-y-3">
                <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E]">
                  info@ytheactiverse.com
                </p>
                <p className="font-jakarta font-bold text-[18px]">
                  800#
                </p>
                
              </div>
            </div>

            {/* Information */}
            <div>
  <h3 className="font-jakarta font-bold text-[20px] leading-[28px] mb-6">
    Information
  </h3>

  <ul className="space-y-5">
    {[
      { label: "Our Blog", path: "/blogs" },
      { label: "Start a Return", path: "/" },
      { label: "Contact Us", path: "/contact" },
    ].map((item) => (
      <li key={item.path}>
        <Link
          to={item.path}
          className="font-jakarta font-medium text-[16px] leading-[29px] text-[#7E7E7E] hover:text-black transition"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>


            {/* Useful Links */}
            <div>
              <h3 className="font-jakarta font-bold text-[20px] leading-[28px] mb-6">
                Useful links
              </h3>
              <ul className="space-y-5">
                {[
                  "My Account",
                  "Become a Vendor",
                  "Shipping FAQ",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="font-jakarta font-medium text-[16px] leading-[29px] text-[#7E7E7E] hover:text-black transition"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            

            {/* Newsletter */}
            <div>
              <h3 className="font-jakarta font-bold text-[20px] leading-[28px] mb-4">
                Newsletter
              </h3>
              <p className="font-jakarta font-medium text-[15px] leading-[27px] text-[#7E7E7E] mb-6">
                Get the latest news, events & more delivered to your inbox.
              </p>

              {/* Email Input */}
              <div className="relative mb-6">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-5 py-4 rounded-xl border border-white bg-white shadow-[0_4px_34px_0_rgba(0,0,0,0.05)] font-jakarta font-medium text-[15px] placeholder:text-[#9B9B9B] focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              
            </div>

            {/* Social Media Links */}
              <div>
                <h3 className="font-jakarta font-bold text-[20px] leading-[28px] mb-4">
               Follow us
              </h3>
                
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/people/The-Activerse/100083580720051/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#F0F0F0] rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/theactiverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#F0F0F0] rounded-lg hover:bg-black hover:text-white transition-colors"
                    aria-label="X"
                  >
                    <svg
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.802-5.974 6.802H2.882l7.732-8.835L1.227 2.25h6.836l4.709 6.231 5.579-6.231zM17.15 18.75h1.832L5.064 3.75H3.15z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/the_activerse/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#F0F0F0] rounded-lg hover:bg-pink-600 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="w-full bg-[#2D2D2D] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Payment Methods */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/4aa9aff5b0a630119db32ae115dfaddf9ca3035a?width=716"
              alt="Payment Methods"
              className="h-6"
            />

            {/* Copyright */}
            <p className="font-jakarta font-medium text-[14px] leading-[20px] text-[#B0B0B0] text-center">
              © {new Date().getFullYear()} TheActiverse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
