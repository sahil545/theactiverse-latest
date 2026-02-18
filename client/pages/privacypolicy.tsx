import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
         <h1 className="text-4xl font-jakarta font-bold mb-8">PRIVACY POLICY</h1>

        <div className="space-y-8">
        <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">Privacy Policy</h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
             Effective Date: 18-02-2026
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              Information We Collect
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              We collect:
            </p><br />
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Name</li>
              <li>Email Address</li>
              <li>Shipping address</li>
              <li>Billing address</li>
              <li>Order information</li>
              <li>Device & usage data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
             How We Use Information
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              We use data to:
            </p><br />
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Process orders</li>
              <li>Prevent fraud</li>
              <li>Improve services</li>
              <li>Send transactional emails</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
             Data Sharing
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              We share limited information with:
            </p><br />
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Vendors (for order fulfillment)</li>
              <li>Payment processors</li>
              <li>Legal authorities if required</li>
            </ul><br />
           <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              We do not sell personal data.
            </p> 
          </section>

            <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
             Security
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              We implement industry-standard security measures to protect user data.
            </p>
            
          </section>
           <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
             Your Rights
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Users may request access or deletion of their data by contacting:<br /><br />
              support@theactiverse.com
            </p>
            
          </section>
        </div>


       
      </div>

      <Footer />
    </div>
  );
}
