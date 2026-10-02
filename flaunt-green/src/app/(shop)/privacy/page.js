import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Flaunt Green",
  description: "Flaunt Green privacy policy outlining data collection, usage, sharing, and user rights.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <section className="container-site py-24 md:py-36">
        <h1 className="font-heading font-bold text-black text-4xl md:text-5xl mb-8 text-center">Privacy Policy</h1>
        <hr className="border-t border-gray-300 my-4" />
        <div className="max-w-4xl mx-auto bg-white p-8 text-left">
        <p className="text-gray-600 leading-relaxed mb-6">
          Flaunt Green is committed to safeguarding the privacy and security of our valued customers, vendors, and all stakeholders. We have developed this Privacy Policy to underscore our commitment to maintaining your trust in our brand. This policy outlines how we collect, use, and protect information when you visit our website, <a href="https://www.flauntgreen.in" className="text-teal-600 hover:underline">www.flauntgreen.in</a>.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Information We Collect Online</h2>
        <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">Personal Information:</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          At Flaunt Green, we define personal information as data by which someone can be personally identified, including but not limited to name, address, telephone number, email address, and information relevant to the provision of our goods or services. Flaunt Green does not store or capture any payment card details. Personal information is collected only when voluntarily provided by you, such as when placing an order, creating an account, participating in surveys or contests, or contacting us with inquiries.
        </p>
        <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">User-Generated Content:</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Reviews and ratings submitted by users will be collected and stored. This content may include personal opinions, usernames, and other identifiable information if provided.
        </p>
        <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">Tracking and Analytics:</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Google Tag Manager and similar tools are used to collect data on user behavior, such as pages visited, time spent on the site, and interactions with content. This data is used for analytics, remarketing, and improving user experience. Third‑party services may also place cookies or similar technologies for tracking and analytics purposes.
        </p>
        <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">Browsing Information; Cookies:</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          When you visit our Site, our servers may automatically recognize certain non‑personally identifiable information, including domain name, IP address, and browser language. We use cookies to enhance your browsing experience and improve site functionality. Disabling cookies may impact certain features on the Site. Additionally, we may use third‑party advertising companies to serve ads on our Site or other platforms, using cookies and action tags to measure ad effectiveness.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">How We Use Your Information</h2>
        <p className="text-gray-600 leading-relaxed mb-4">Flaunt Green utilizes the personal information collected for various purposes, including:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Fulfilling orders and providing requested services.</li>
          <li>Enhancing site functionality and user experience.</li>
          <li>Understanding customer preferences and needs.</li>
          <li>Developing, marketing, and selling products and services.</li>
          <li>Conducting surveys, research, and evaluations.</li>
          <li>Managing business operations and processing payments.</li>
          <li>Detecting and preventing fraud or illegal activities.</li>
          <li>Complying with legal or regulatory requirements.</li>
          <li>Analyzing user‑generated content (reviews, ratings) to improve products and services.</li>
          <li>Using data collected via Google Tag Manager and other analytics tools to optimize marketing efforts, personalize content, and measure ad performance.</li>
        </ul>
        <p className="text-gray-600 leading-relaxed mb-4">We may combine information collected from the Site with data obtained through other channels to better serve you.</p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">How We May Share Information</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Flaunt Green may share collected information with affiliated companies, selected third‑party service providers, and as required by law or legal processes. Third‑party websites linked on our Site are subject to their respective privacy policies, and Flaunt Green is not responsible for their content or practices. In the event of a merger, acquisition, or restructuring, customer information may be transferred as part of the assets, subject to the pre‑existing privacy policy.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          User‑generated content (reviews, ratings) may be displayed publicly on the website or shared with third‑party platforms for marketing or promotional purposes.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Data collected via Google Tag Manager and other analytics tools may be shared with third‑party service providers for analytics, advertising, or other business purposes, as permitted by their respective privacy policies.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Cookies and Tracking Technologies</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Google Tag Manager and other tracking technologies are used to collect and process data. Users can opt out of certain tracking by adjusting browser settings or using tools like Google’s Ads Settings or the Network Advertising Initiative’s opt‑out page.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Third‑Party Links and Services</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The website may integrate third‑party services (e.g., Google Tag Manager, review platforms) that have their own privacy policies. Flaunt Green is not responsible for the practices of these third parties, and users are encouraged to review their policies.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Security</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We employ various security measures, including Secure Socket Layer (SSL) encryption and firewall technology, to protect the personal information submitted through our Site. Payment information is processed through a secure payment gateway managed by our trusted partner. While we strive to ensure the security of your data, no method of transmission over the Internet is 100% secure.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">User Rights and Choices</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Users can request the removal or modification of their reviews or ratings by contacting <a href="mailto:support@flauntgreen.in" className="text-teal-600 hover:underline">support@flauntgreen.in</a>. Users may opt out of data collection by Google Tag Manager or other tracking technologies by following the opt‑out procedures provided by those services.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Managing Your Personal Information</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Flaunt Green encourages the regular review and updating of personal information. You may request a summary of the information we have on record, correct inaccuracies, or opt out of communications by contacting us at <a href="mailto:support@flauntgreen.in" className="text-teal-600 hover:underline">support@flauntgreen.in</a>. Some data may be retained for transactional, legal, or technical purposes even after your request.
        </p>

        <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Updating This Policy: Notices</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Flaunt Green reserves the right to modify this Privacy Policy at any time. We recommend periodic review of this page for updates. Your continued use of our Site constitutes acceptance of any changes made to this policy. In the event of a security breach, we may notify affected individuals via email, where feasible.
        </p>
</div>
      </section>
    </div>
  );
}
