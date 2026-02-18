import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">

        <h1 className="text-4xl font-jakarta font-bold mb-8">Terms & Conditions</h1>
        <div className="space-y-8"> 
          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">1. Overview</h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              THEACTIVERSE is an online marketplace connecting independent sports brands (“Vendors”) with customers (“Users”). We provide platform technology and payment facilitation but do not manufacture or directly sell products unless otherwise stated.
 <br /><br />By accessing this website, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              2. Marketplace Role
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              We collect:
            </p><br />
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Hosts vendor storefronts</li>
              <li>Processes payments via secure third-party processors</li>
              <li>Facilitates transactions</li>
            </ul><br />
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Vendors are solely responsible for:
            </p><br />
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Product accuracy</li>
              <li>Shipping</li>
              <li>Returns & warranties</li>
              <li>Compliance with applicable laws</li>
            </ul>
          </section>
        
        <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              3. Payments
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              All payments are securely processed via PCI-compliant third-party providers.<br /><br />

We do not store full credit card numbers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              4. Returns & Refunds
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Return policies are set by individual Vendors and displayed on each product page.<br /><br />
 
THEACTIVERSE may assist in resolving disputes but is not liable for product issues.
            </p>
          </section>

        <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              5. Prohibited Use
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Users may not:<br /><br />
            </p>
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Submit false information</li>
              <li>Violate laws</li>
              <li>Interfere with site security</li>
            </ul>
          </section>

        <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
             6. Limitation of Liability
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              THEACTIVERSE is not liable for:<br /><br />
            </p>
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Product defects</li>
              <li>Shipping delays</li>
              <li>Vendor misconduct</li>
            </ul><br />
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Maximum liability is limited to the amount paid for the transaction.<br /><br />
            </p>
          </section>

       <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              7. Governing Law
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
             These Terms are governed by the laws of the State of [Insert State].
            </p>
          </section>

        
        </div>
      </div>

      <Footer />
    </div>
  );
}
