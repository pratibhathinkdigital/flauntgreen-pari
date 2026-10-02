import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | Flaunt Green",
  description: "Flaunt Green terms and conditions covering offers, product specifications, pricing, and agreements.",
};

export default function TermsPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <section className="container-site py-24 md:py-36">
        <h1 className="font-heading font-bold text-black text-4xl md:text-5xl mb-8 text-center">Terms and Conditions</h1>
        <hr className="border-t border-gray-300 my-4" />
        <div className="max-w-4xl mx-auto bg-white p-8 text-left">
          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Offers and Amendments</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            All offers provided by Flaunt Green are non-binding and may be withdrawn at any time unless explicitly stated otherwise in writing. Any amendments made by Flaunt Green in writing shall constitute a new offer, automatically revoking the previous offer. Any amendments made by the customer to an offer by Flaunt Green will be considered a new offer by the customer, subject to acceptance or rejection at Flaunt Green's sole discretion. Offers will only be deemed accepted by Flaunt Green if confirmed in writing.
          </p>

          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Product Specifications</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Customers acknowledge and accept that all samples, colors, drawings, models, dimensions, weights, or any other product specifications provided by Flaunt Green are estimates only, with best efforts made to ensure accuracy. Minor deviations, especially in colour tones, cannot be considered defects of the product.
          </p>

          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Price and Configurations</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Product configurations and prices are subject to change at any time, and Flaunt Green reserves the right to modify price lists, brochures, quotations, and other documents accordingly.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            All prices quoted by Flaunt Green are exclusive of any taxes, duties, levies, fees, or similar charges imposed by any taxing authority, unless the customer has provided an appropriate resale or exemption certificate for the delivery location. In the event of changes in law resulting in irrecoverable taxes that increase the costs to Flaunt Green for delivering the products, Flaunt Green reserves the right to adjust prices accordingly and retroactively.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Prices or fees quoted by Flaunt Green are in INR unless otherwise stated in writing.
          </p>

          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Agreements and Deliveries</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Each agreement for the delivery of products by Flaunt Green shall be treated as a separate agreement.
          </p>
        </div>
      </section>
    </div>
  );
}
