import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Flaunt Green",
  description: "Flaunt Green disclaimer policy covering product variations and return guidelines.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-white overflow-x-hidden">
      <section className="container-site py-24 md:py-36">
        <h1 className="font-heading font-bold text-black text-4xl md:text-5xl mb-8 text-center">Disclaimer</h1>
        <hr className="border-t border-gray-300 my-4" />
        <div className="max-w-4xl mx-auto bg-white p-8 text-left">
           <h2 className="font-heading font-semibold text-black text-2xl md:text-3xl mt-10 mb-4">Disclaimer Policy</h2>
           <p className="text-gray-600 leading-relaxed mb-4">
             The information contained in this website is for general information purposes only. The information is provided by Flaunt Green and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
           </p>
           <p className="text-gray-600 leading-relaxed mb-4">
             In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website. Through this website you are able to link to other websites which are not under the control of Flaunt Green. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. Every effort is made to keep the website up and running smoothly. However, Flaunt Green takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.
           </p>
           <h3 className="font-heading font-medium text-gray-800 text-xl mt-6 mb-2">Contact Information</h3>
           <p className="text-gray-600 leading-relaxed mb-4">
             Flaunt Green is located at<br/>
             Address :  9 & 10, ADI House, Vijay Manjrekar Rd, Chandrakant Dhuru Wadi, Dadar, Mumbai, Maharashtra 400028<br/>
             Phone :  <a href="tel:+917710030888" className="text-teal-600 hover:underline">+91 77100 30888</a><br/>
             Email:  <a href="mailto:support@flauntgreen.in" className="text-teal-600 hover:underline">support@flauntgreen.in</a><br/>
             Website: <a href="https://flauntgreen.in" className="text-teal-600 hover:underline">https://flauntgreen.in</a>
           </p>
        </div>
      </section>
    </div>
  );
}
