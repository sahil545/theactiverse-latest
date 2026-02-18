import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function ShippingFAQ() {


  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-jakarta font-bold mb-8">SHIPPING POLICY</h1>
      <div className="space-y-8"> 
        <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">Overview</h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Because THEACTIVERSE is a marketplace, shipping is handled by independent Vendors.
            </p>
          </section>
        
        <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">Processing Times</h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Processing times vary by Vendor and are listed on each product page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              Shipping Methods
            </h2>
             <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Vendors determine:
            </p><br />
            <ul className="list-disc list-inside space-y-2 font-jakarta text-[16px] text-[#7E7E7E]">
              <li>Carrier</li>
              <li>Delivery time</li>
              <li>Shipping cost</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              International Orders
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
              Customers are responsible for customs duties and import taxes where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-jakarta font-bold mb-4">
              Delays
            </h2>
            <p className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
             THEACTIVERSE is not responsible for shipping delays caused by carriers or external events.
            </p>
          </section>

        

       {/* <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-jakarta font-semibold text-black hover:text-[#2D7A3E]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-jakarta text-[16px] text-[#7E7E7E] leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 p-8 bg-[#F5F5F5] rounded-lg">
          <h2 className="text-2xl font-jakarta font-bold mb-4">
            Still need help?
          </h2>
          <p className="font-jakarta text-[16px] text-[#7E7E7E] mb-6">
            If you can't find the answer you're looking for, please don't
            hesitate to contact our customer service team.
          </p>
          <div className="space-y-2">
            <p className="font-jakarta text-[16px] text-[#7E7E7E]">
              <span className="font-semibold">Email:</span>{" "}
              info@theactiverse.com
            </p>
            <p className="font-jakarta text-[16px] text-[#7E7E7E]">
              <span className="font-semibold">Phone:</span> 800#
            </p>
          </div>
        </div>*/}
        </div>
      </div>

      <Footer />
    </div>
  );
}
