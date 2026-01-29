import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ShippingFAQ() {
  const faqItems = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days. Overnight shipping is available for orders placed before 2 PM EST. Shipping times are calculated from the date your order is processed, not from the order date.",
    },
    {
      question: "What are the shipping costs?",
      answer:
        "Shipping costs vary based on your location and the shipping method selected. Free shipping is available on orders over $100. Standard shipping starts at $5.99. You'll see the exact shipping cost before checkout.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping times typically range from 10-21 business days depending on the destination. International orders may be subject to customs duties and taxes, which are the customer's responsibility.",
    },
    {
      question: "Can I change my shipping address after placing an order?",
      answer:
        "You can change your shipping address within 2 hours of placing your order. Log into your account, go to 'My Orders', and select the order you wish to modify. If more than 2 hours have passed, please contact our customer service team immediately.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on the carrier's website. Alternatively, log into your account on The Activerse website and check the status in 'My Orders'.",
    },
    {
      question: "What if my order hasn't arrived?",
      answer:
        "If your order hasn't arrived within the estimated delivery window, first check the tracking information. If the tracking shows it was delivered but you haven't received it, please check with neighbors or your building management. Contact us at info@theactiverse.com if you still can't locate your package.",
    },
    {
      question: "Are there any items that don't ship?",
      answer:
        "Most items ship worldwide. However, some items may be restricted due to local regulations. You'll be notified at checkout if an item in your cart cannot be shipped to your location.",
    },
    {
      question: "Do you offer express or overnight shipping?",
      answer:
        "Yes! Express shipping (2-3 business days) and overnight shipping are available for most US orders. Select your preferred shipping method during checkout. Express and overnight options are typically $15-$25 depending on your location.",
    },
    {
      question: "What happens if my package is lost or damaged?",
      answer:
        "We insure all shipments. If your package arrives damaged, take photos of the damage and contact us within 48 hours with your order number. For lost packages, contact us if tracking shows it hasn't arrived within the estimated delivery date. We'll work with the carrier to locate your package or issue a replacement/refund.",
    },
    {
      question: "Can I get a refund for shipping costs?",
      answer:
        "Shipping costs are generally non-refundable. However, if the return is due to our error (wrong item, defective item, etc.), we'll refund shipping costs both ways. If you received a damaged item, shipping refunds are included in your return.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-jakarta font-bold mb-4">Shipping FAQ</h1>
        <p className="font-jakarta text-[16px] text-[#7E7E7E] mb-12">
          Find answers to common questions about shipping and delivery
        </p>

        <Accordion type="single" collapsible className="w-full">
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
          <h2 className="text-2xl font-jakarta font-bold mb-4">Still need help?</h2>
          <p className="font-jakarta text-[16px] text-[#7E7E7E] mb-6">
            If you can't find the answer you're looking for, please don't hesitate to contact our customer service team.
          </p>
          <div className="space-y-2">
            <p className="font-jakarta text-[16px] text-[#7E7E7E]">
              <span className="font-semibold">Email:</span> info@theactiverse.com
            </p>
            <p className="font-jakarta text-[16px] text-[#7E7E7E]">
              <span className="font-semibold">Phone:</span> 800#
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
