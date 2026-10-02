import Link from "next/link";

export const metadata = {
  title: "Returns and Exchanges Policy | Flaunt Green",
  description: "Flaunt Green returns and exchanges policy outlining our sustainable approach and process.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <section className="container-site py-24 md:py-36">
        <h1 className="font-heading font-bold text-black text-4xl md:text-5xl mb-8 text-center">Returns and Exchanges Policy</h1>
        <hr className="border-t border-gray-300 my-4" />
        <div className="max-w-4xl mx-auto bg-white p-8 text-left">
          <p className="text-gray-600 leading-relaxed mb-4">
            At Flaunt Green, we follow a slow and sustainable approach to fashion, producing our garments in small batches with great care. Each piece goes through multiple and rigorous in‑house quality checks, from design to final dispatch – to ensure you receive the best possible product.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            As part of this model, we currently follow a no return or exchange policy. We kindly request you to review the sizing details carefully before placing your order.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 font-semibold">
            That said, your satisfaction is very important to us <span role="img" aria-label="green heart">💚</span>
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Since each of our products is handcrafted, slight variations in color, texture, or finish may occur. These are a natural part of the process and make every piece unique.
          </p>

          <h2 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">🧵 In Case of an Issue</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you happen to receive:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>An incorrect product, or</li>
            <li>An incorrect size</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-4">
            Please reach out to us within 48 hours of delivery at <a href="mailto:support@flauntgreen.in" className="text-teal-600 hover:underline">support@flauntgreen.in</a>, along with:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>Your Order Number</li>
            <li>Clear images of the issue</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-4">Our team will review your request at the earliest.</p>

          <h2 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">📦 Return Process (If Approved)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Once your request is verified and approved, we will guide you through the next steps. You may be asked to send the product back to us at the address below:
          </p>
          <address className="not-italic text-gray-600 leading-relaxed mb-4">
            Flaunt Green<br />
            (Green Initiatives &amp; Sustainable Solutions, An Initiative of Eco Ventures Private Limited)<br />
            9/10 Adi House, Vijay Manjrekar Marg<br />
            Gokhale Road (N), Dadar West<br />
            Mumbai – 400028, Maharashtra<br />
            Landmark: (Opp. Portuguese Church)
          </address>
          <p className="text-gray-600 leading-relaxed mb-4">Kindly ensure that the item is:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>Unworn, unwashed, and unscented</li>
            <li>In its original condition</li>
            <li>With all tags and invoice intact</li>
            <li>Returned in original packaging</li>
          </ul>

          <h2 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">🔍 Quality Check &amp; Resolution</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Once we receive the product, our Quality Control team will inspect it.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>If approved, we will ship the correct item to you at no additional cost, subject to availability.</li>
            <li>If the requested item is out of stock, we will initiate a refund for your order.</li>
          </ul>

          <h2 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">🚫 Non‑Eligible Items</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The following items are not eligible for return or exchange:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>Products purchased during sales, discounts, or live events</li>
            <li>Dog Togs products (due to hygiene considerations)</li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-4">
            We truly appreciate your understanding and support as we work towards building a more thoughtful and sustainable fashion ecosystem.
          </p>
          <p className="text-gray-600 leading-relaxed font-semibold">
            If you have any other queries, we are happy to help <span role="img" aria-label="green heart">💚</span>
          </p>

          <div className="mt-8 p-6 bg-[#FAF8F5] border border-[#d4cbbd] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-slate-800 text-base">Have an issue with your delivered order?</h4>
              <p className="text-xs text-slate-500 mt-1">If received within 48 hours, you can submit your return request and proof photos directly from your order dashboard.</p>
            </div>
            <Link
              href="/account/orders"
              className="px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344326] transition-colors whitespace-nowrap shadow-soft-sm"
            >
              Go to My Orders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
