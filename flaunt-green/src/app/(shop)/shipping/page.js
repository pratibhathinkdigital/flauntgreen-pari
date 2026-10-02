import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | Flaunt Green",
  description: "Flaunt Green shipping policy covering delivery times, international shipping, and partners.",
};

export default function ShippingPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <section className="container-site py-24 md:py-36">
        <h1 className="font-heading font-bold text-black text-4xl md:text-5xl mb-8 text-center">Shipping Policy</h1>
        <hr className="border-t border-gray-300 my-4" />
        <div className="max-w-4xl mx-auto bg-white p-8 text-left">
          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Flaunt Green Shipping Policy India</h2>
          <p className="text-gray-600 leading-relaxed mb-4"><strong>Free Shipping!</strong> Just check your pincode with us.</p>

          <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">Please Note:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Orders cannot be shipped to PO boxes or military addresses.</li>
            <li>Rural domestic addresses may require one or more additional days for delivery.</li>
            <li>Orders are typically delivered within 8‑14 working days. However, in unusual cases, delays may occur due to unexpected conditions.</li>
          </ul>

          <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">International</h3>
          <p className="text-gray-600 leading-relaxed mb-4">Kindly reach out to us at <a href="mailto:support@flauntgreen.in" className="text-teal-600 hover:underline">support@flauntgreen.in</a></p>

          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Important Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>We strive to ship your order within 3‑10 working days from the date of receipt.</li>
            <li>The estimated delivery date provided is approximate and not final.</li>
            <li>We are not liable for delays caused by natural calamities, strikes, or other unavoidable circumstances.</li>
            <li>If you suspect tampering or damage to your package, refuse delivery and contact us immediately at <a href="tel:+917710030888" className="text-teal-600 hover:underline">+91 77100 30888</a> or <a href="mailto:support@flauntgreen.in" className="text-teal-600 hover:underline">support@flauntgreen.in</a> with your order number. We are available Monday‑Friday, 9am‑6pm IST. We will investigate and dispatch a replacement promptly.</li>
          </ul>

          <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Shipping Partners</h2>
          <p className="text-gray-600 leading-relaxed mb-4">To ensure prompt and secure delivery, we partner with reputable courier agencies:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Local shipments are handled by <strong>Delhivery</strong>.</li>
            <li>International couriers are managed by <strong>Aramex</strong>.</li>
            <li>All shipments are fully insured and require a recipient's signature and proof of ID confirmation upon delivery.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
