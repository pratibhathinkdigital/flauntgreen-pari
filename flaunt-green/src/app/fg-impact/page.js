"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function FGImpactPage() {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px]">
        <Image 
          src="/assets/Sustainability/FG_Impact/FGImpactLP.png" 
          alt="FG Impact" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-wide text-center px-4 shadow-sm">
            FG IMPACT
          </h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 md:px-12 w-full max-w-7xl mx-auto space-y-8">
        <h2 className="font-sans font-bold leading-tight mb-12 text-center"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 4.5vw, 56px)",
            color: "#1C2A3A",
          }}>Tangible Impact achieved so far...</h2>
        
        <div className="bg-[#fcfaf7] p-8 md:p-12 rounded-xl shadow-sm border border-[#e6dccd] space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <p className="font-semibold text-gray-900">
            Please note that the following data estimates are derived from publicly available data from recognised government, industry and research sources, benchmarked against equivalent powerloom production within the Indian textile context.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Sources include, but are not limited to:</span> Ministry of Textiles, Government of India — Annual Reports on the Handloom Sector and Handloom Census of India; Office of the Development Commissioner (Handlooms), Government of India; The Energy and Resources Institute (TERI) — studies on energy consumption in textile manufacturing; Central Pollution Control Board (CPCB), India — emission factors and industrial pollution benchmarks; and the International Labour Organization (ILO) — research on occupational safety and employment intensity across textile sectors.
          </p>
          <p className="italic text-gray-600">
            Impact figures represent comparative estimates and may vary depending on fibre, manufacturing processes, energy sources and production conditions.
          </p>
        </div>
      </section>

      {/* Tags Section */}
      <section className="py-12 px-4 md:px-12 w-full max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Handloom Tag */}
          <div 
            onClick={() => setActiveTab(activeTab === 'handloom' ? null : 'handloom')}
            className={`cursor-pointer transition-all duration-300 transform ${activeTab === 'handloom' ? 'scale-[1.02] ring-2 ring-[#8C7A4E]' : 'hover:-translate-y-2'} bg-white border-4 border-[#3c2a1a] p-8 rounded-sm relative`}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-[#3c2a1a] flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 rounded-full border border-gray-400"></div>
            </div>
            <h3 className="text-2xl font-bold mt-4 mb-6 border-b-2 border-gray-200 pb-4">HANDLOOM - A CONSCIOUS CHOICE</h3>
            <p className="font-semibold mb-6 italic text-gray-800">
              The 2413 meters of hand loomed cotton fabric (which is 62.5% of our entire fabric consumption to date) we have used so far has had the following environmental benefits over equivalent powerloom fabric -
            </p>
            <ul className="space-y-4 list-disc pl-5 mb-8 text-gray-700">
              <li><strong className="text-gray-900 underline">Energy Savings Equivalent</strong> to running a 1-ton AC continuously for 2-3 months</li>
              <li><strong className="text-gray-900 underline">Savings in CO2 Emissions</strong> are equivalent to burning 1,400 liters of petrol, or Annual CO2 absorption by 150 mature trees</li>
              <li><strong className="text-gray-900 underline">Savings in Water Consumption</strong> is equivalent to 4,223 person-days of water (assuming 4 litres per person per day)</li>
              <li><strong className="text-gray-900 underline">Impact on Fashion Lifecycle</strong> - Enormous impact due to small batch, low waste, & mindful production</li>
              <li><strong className="text-gray-900 underline">Social Empowerment</strong> - Recognising these skilled artisans as custodians of our cultural heritage - Priceless</li>
            </ul>
            <div className="text-sm font-semibold text-gray-600 bg-gray-50 p-4 border border-gray-200">
              PLEASE NOTE: This quantification is assesed for the Weaving Stage only, and the basis of quantification is direct electrical input difference for the Indian electric carbon grid.
            </div>
            
            <div className="mt-8 text-center text-[#8C7A4E] font-medium tracking-widest text-sm uppercase">
              {activeTab === 'handloom' ? 'Close Details' : 'Click to Read More Data'}
            </div>
          </div>

          {/* Khadi Tag */}
          <div 
            onClick={() => setActiveTab(activeTab === 'khadi' ? null : 'khadi')}
            className={`cursor-pointer transition-all duration-300 transform ${activeTab === 'khadi' ? 'scale-[1.02] ring-2 ring-[#8C7A4E]' : 'hover:-translate-y-2'} bg-white border-4 border-[#3c2a1a] p-8 rounded-sm relative`}
          >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-[#3c2a1a] flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 rounded-full border border-gray-400"></div>
            </div>
            <h3 className="text-2xl font-bold mt-4 mb-6 border-b-2 border-gray-200 pb-4">THE CASE FOR KHADI</h3>
            <p className="font-semibold mb-6 italic text-gray-800">
              The 813 meters of hand loomed cotton fabric (which is 21% of our entire fabric consumption to date) we have used so far. The following environmental advantages were assessed for handspun yarn versus mill spun yarn for the Indian textile context:
            </p>
            <ul className="space-y-4 list-disc pl-5 mb-8 text-gray-700">
              <li><strong className="text-gray-900 underline">Energy Savings Equivalent</strong> to powering a 10 W LED light bulb continuously for 7 years</li>
              <li><strong className="text-gray-900 underline">Savings in CO2 Emissions</strong> are equivalent to petrol required by a typical passenger car for a Mumbai Delhi round trip</li>
              <li><strong className="text-gray-900 underline">Savings in Water Consumption</strong> is equivalent to filling more than 31 standard bathtubs</li>
              <li><strong className="text-gray-900 underline">Rural Empowerment</strong> - Handspun yarn supports decentralised livelihoods and generates up to 10–30 times more rural employment than conventional mill-spun yarn, while empowering women artisans and preserving India's traditional textile heritage.</li>
              <li><strong className="text-gray-900 underline">Unique & Distinctive</strong> Textured Garments are made from handspun yarn, which are naturally breathable, comfortable, durable, and thermoregulating, while their subtle texture and artisanal character</li>
            </ul>
            <div className="text-sm font-semibold text-gray-600 bg-gray-50 p-4 border border-gray-200">
              PLEASE NOTE: This quantification assessed for handspun yarn versus mill spun yarn including at carding, sliver, and yarn-making stages only. The basis of quantification is direct electrical input difference for manual, mechanical, and solar powered operations in the Indian textile grid.
            </div>

            <div className="mt-8 text-center text-[#8C7A4E] font-medium tracking-widest text-sm uppercase">
              {activeTab === 'khadi' ? 'Close Details' : 'Click to Read More Data'}
            </div>
          </div>

        </div>
      </section>

      {/* Expanded Details Section */}
      {activeTab && (
        <section className="py-20 px-4 md:px-12 w-full bg-[#fcfaf7] border-t border-[#e6dccd]">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {activeTab === 'handloom' && (
              <div className="animate-fade-in space-y-16">
                <h2 className="font-sans font-bold leading-tight mb-12 text-center"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 4.5vw, 56px)",
            color: "#1C2A3A",
          }}>Handloom: A Conscious Choice - Detailed Data</h2>
                
                {/* 1. ENERGY CONSUMPTION */}
                <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">1. ENERGY CONSUMPTION</h3>
                  <div className="space-y-2">
                    <p><strong>Powerloom Cotton:</strong> ~0.5–3.1 kWh per meter (use midpoint - 1.8 kWh per meter)</p>
                    <p><strong>Handloom:</strong> ~0.05 - 0.15 kWh per meter (use midpoint: 0.1 kWh per meter)</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Handloom weaving is primarily human-powered with negligible auxiliary electricity (lighting). In contrast, powerlooms require continuous electrical energy for motors, drive systems, and control units.
                  </p>
                  <div className="bg-gray-50 p-6 rounded border-l-4 border-[#8C7A4E] font-medium text-lg">
                    Net savings in energy for Handloom versus Powerloom is ((1.8-0.1)/1.8)*100 = <span className="text-[#8C7A4E]">~95%</span>
                    <br/><br/>
                    For 2413 meters of fabric energy saved by handloom versus powerloom is (1.8-0.1)kWh/m * 2413 meters = <span className="text-[#8C7A4E]">4102.1 kWh</span>
                  </div>
                </div>

                {/* 2. GHG EMISSIONS */}
                <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">2. GHG EMISSIONS</h3>
                  <p className="font-semibold text-lg">GHG EMISSIONS = ENERGY CONSUMED * GRID EMISSION FACTOR</p>
                  <div className="space-y-2 text-gray-700">
                    <p>India grid emission factor (0.7 - 0.9 kg CO₂ e/kWh)</p>
                    <p>Use an average emission factor of 0.8 kg CO₂ e/kWh</p>
                    <div className="py-4 font-mono text-sm sm:text-base space-y-2 bg-gray-50 p-4 rounded mt-4">
                      <p>Handloom Emissions = 0.1 kWh per meter * 0.8 kg CO₂ e/kWh = 0.08 kg CO₂ e/m</p>
                      <p>Powerloom Emissions = 1.8 kWh per meter * 0.8 kg CO₂ e/kWh = 1.44 kg CO₂ e/m</p>
                      <p className="font-bold pt-2 border-t border-gray-300 mt-2">Net savings in energy for Handloom versus Powerloom is ((1.44-0.08)/1.44)*100 = ~95%</p>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <p className="font-semibold text-lg mb-4">For 2413 meters of fabric,</p>
                    <div className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded font-mono text-sm sm:text-base">
                      <p>HANDLOOM GHG = 2413 M * 0.1 kWh per meter * 0.8 kg CO₂ e/kWh = 193 kg CO₂ e</p>
                      <p>POWERLOOM GHG = 2413 M * 1.8 kWh per meter * 0.8 kg CO₂ e/kWh = 3474.72 kg CO₂ e</p>
                      <p className="font-bold pt-4 border-t border-gray-300 mt-4">SAVINGS = (3474.2 - 193)/ 3474.2 = (3281.2/ 3474.3) = ~95%</p>
                    </div>
                  </div>
                  <div className="bg-[#f0ece1] p-6 rounded-lg text-xl font-bold text-center text-[#5c4a1e] shadow-inner mt-6">
                    GHG emissions saved by handloom versus powerloom is<br/>
                    = (4343.4 - 241.3) kWh * 0.8 kg CO₂ e/kWh = 3281.68 kg CO₂ e <span className="text-[#8C7A4E] text-2xl">~ 3.3 tonnes CO₂</span>
                  </div>
                </div>

                {/* 3. WATER CONSUMPTION */}
                <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">3. WATER CONSUMPTION</h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                    <p>
                      Indian handloom systems are manually operated and decentralized, requiring minimal machinery-related water demand. While actual direct loom-operational water use during weaving is near-zero; minimal spraying may be required for yarn moistening (to prevent breakage and reduce static electricity), and starch/ sizing preparation. Due to weaving occurring in naturally ventilated environments manual humidity control required is also negligible. Therefore assuming <strong>0 - 1 liter/ meter</strong>.
                    </p>
                    <p>
                      In Powerloom setups, water is used in the weaving area as part of the HVAC or air-handling system. It is required for maintaining optimum humidity (60% - 80%) to prevent yarn breakage and control lint. Across the Indian textile industry, conventional cotton powerloom weaving is estimated to consume approximately <strong>3 - 12 liters</strong> of water per meter of fabric during the weaving stage and associated weaving-support operations. Water demand primarily arises from humidification systems, sizing/desizing support, loom-room moisture control, and maintenance processes rather than from the weaving action itself.
                    </p>
                    <div className="bg-gray-50 p-6 rounded border-l-4 border-[#4a8eb5] mt-6 font-medium">
                      If we use midpoints 0.5 liters/ m and 7.5 liters/ m of cotton fabric for handloom and powerloom respectively (for quantification), there is a resultant = (7.5 - 0.5)/ 7.5 = <span className="text-[#4a8eb5] font-bold">94% savings</span>.
                      <br/><br/>
                      <span className="text-lg">The net savings for 2,413 meters of fabric (at 7 liter/ meter) is <span className="font-bold text-[#4a8eb5] text-xl">16,891 liters</span></span>
                    </div>
                  </div>
                </div>

                {/* 4. NOISE & AIR POLLUTANTS */}
                <div className="space-y-12 bg-white p-8 rounded-lg shadow-sm">
                  
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">4. NOISE LEVELS</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Handlooms</strong> operate at low mechanical speeds with manual actuation. Range between 40-70 dB (average 55 dB)</li>
                      <li><strong>Powerlooms</strong> operate at high RPM with metal components and motors. Range from 95-105 dB (average 100 dB)</li>
                      <li>Range in improvement = (95-40)/95 = 57.89% to (105-70)/105 = 33.33%</li>
                    </ul>
                    <p className="font-bold text-lg bg-gray-50 p-4 rounded inline-block">Result: Significant reduction in occupational noise exposure (35–60% lower perceived intensity).</p>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">5. AIR POLLUTANTS</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Handlooms</strong> generate low emissions including cotton lint</li>
                      <li><strong>Powerlooms</strong> generate particulate matter (fiber and dust), oil mist (from lubrication systems), and heat emissions.</li>
                    </ul>
                    
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-left border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100 text-gray-900 text-sm md:text-base">
                            <th className="border border-gray-300 p-4 font-bold">PARAMETERS</th>
                            <th className="border border-gray-300 p-4 font-bold">PM2.5 µg/ m3</th>
                            <th className="border border-gray-300 p-4 font-bold">PM10 µg/ m3</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm md:text-base font-medium">
                          <tr>
                            <td className="border border-gray-300 p-4 bg-white">Rural Indian Handloom Weaving</td>
                            <td className="border border-gray-300 p-4 bg-white text-center">15 - 40</td>
                            <td className="border border-gray-300 p-4 bg-white text-center">40 - 90</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-4 bg-white">Poorly Ventilated Handloom Spaces</td>
                            <td className="border border-gray-300 p-4 bg-white text-center">30 - 60</td>
                            <td className="border border-gray-300 p-4 bg-white text-center">70 - 150</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-4 bg-white">Average Handloom Spaces</td>
                            <td className="border border-gray-300 p-4 bg-white text-center">15 - 60</td>
                            <td className="border border-gray-300 p-4 bg-white text-center">40 - 150</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-4 bg-gray-50 font-bold">Powerloom</td>
                            <td className="border border-gray-300 p-4 bg-gray-50 font-bold text-center">80 - 250</td>
                            <td className="border border-gray-300 p-4 bg-gray-50 font-bold text-center">150 - 500</td>
                          </tr>
                          <tr className="bg-[#e6f2eb]">
                            <td className="border border-gray-300 p-4 font-bold text-[#2a5c3d]">Improvement of Handloom vs Powerloom</td>
                            <td className="border border-gray-300 p-4 font-bold text-[#2a5c3d] text-center">(81.25 - 76)%</td>
                            <td className="border border-gray-300 p-4 font-bold text-[#2a5c3d] text-center">(73.3 - 70)%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="font-bold text-lg bg-gray-50 p-4 rounded inline-block text-[#2a5c3d] border border-[#2a5c3d]">Result: 70–85 % reduction in airborne pollutants.</p>
                  </div>
                </div>

                {/* 6. MECHANICAL RISKS & INFRASTRUCTURE */}
                <div className="space-y-10 bg-white p-8 rounded-lg shadow-sm">
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">6. MECHANICAL RISKS</h3>
                    <p className="text-gray-700">Powerlooms involve high-speed moving parts with risks of entanglement and crush injuries. Handlooms operate at low speeds with manual control.</p>
                    <p className="font-bold text-gray-900 bg-gray-50 p-3 rounded border-l-4 border-gray-400">Result: Handlooms have 70–90% lower risk of mechanical injury.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">7. INFRASTRUCTURE ENERGY DEMANDS</h3>
                    <p className="text-gray-700">Powerloom facilities require lighting, ventilation, and motorized infrastructure. Handloom setups are decentralized and low-energy.</p>
                    <p className="font-bold text-gray-900 bg-gray-50 p-3 rounded border-l-4 border-[#8C7A4E]">Result: 75–90% lower infrastructure-related energy demand in handloom processes</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">8. WASTE & RESOURCE EFFICIENCY</h3>
                    <p className="text-gray-700">Handloom operations offer small-batch, low waste production, while mass production in Powerlooms, leads to overproduction and deadstock. This "hidden impact" result in significant as carbon savings in fashion lifecycle terms.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">9. SOCIAL EMPOWERMENT</h3>
                    <p className="text-gray-700 text-justify">Handloom production is labor-intensive and decentralized, supporting rural livelihoods. Handloom also recognises the workers as skilled artisans that are preserving a cultural heritage. Powerloom production is capital-intensive with lower employment per unit output. The workers are seen as menial labourers.</p>
                    <p className="font-bold text-gray-900 bg-gray-50 p-3 rounded border-l-4 border-[#c57a4e] text-lg">Result: 2–4× higher employment generation per meter of fabric.</p>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="bg-[#fcf7e6] p-10 rounded-xl shadow-md border-2 border-[#8C7A4E] text-center space-y-4">
                  <h3 className="text-3xl font-serif text-[#5c4a1e]">Key Conclusion</h3>
                  <p className="text-lg font-bold text-gray-900 leading-relaxed max-w-4xl mx-auto underline underline-offset-4 decoration-[#8C7A4E] decoration-2">
                    Within the weaving-stage boundary, handloom fabrics demonstrate substantial environmental advantages across all measurable parameters, particularly in energy use, emissions, and resource consumption. These advantages in handloom fabrics are structurally inherent due to the absence of mechanized energy input and industrial infrastructure.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'khadi' && (
              <div className="animate-fade-in space-y-16">
                <h2 className="font-sans font-bold leading-tight mb-12 text-center"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 4.5vw, 56px)",
            color: "#1C2A3A",
          }}>The Case For Khadi - Detailed Data</h2>
                
                {/* 1. ENERGY CONSUMPTION */}
                <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">1. ENERGY CONSUMPTION</h3>
                  <div className="space-y-4 text-gray-700">
                    <p className="font-semibold text-gray-900">(Carding, Sliver, and Yarn making Stages Only): Basis of Quantification is Direct electrical input difference</p>
                    <p>Energy consumption of khadi spun yarn (including manual, mechanical, and solar powered operations) range from <strong>0.35 - 0.53 kWh/ kg of yarn</strong> versus for Mill spun yarn which range between <strong>4.59 - 6.42 kWh/ kg of yarn</strong>.</p>
                    <p>Assuming the average values for khadi spun yarn and mill spun yarn at <strong>0.283 and 5.505 kWh/ kg yarn</strong>, respectively.</p>
                    <p className="text-xl font-bold text-[#8C7A4E]">Potential Energy savings by using khadi spun yarn over mill spun yarn is ~95%</p>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 mt-6">
                    <p className="font-semibold text-lg text-gray-900 mb-4">
                      For our total consumption of 813 m of khadi thus far, assuming a 140 - 150 gsm fabric and 1 m panna. The total fabric weight is 145 grams/ sq m * 813 m * 1 m (panna) = 1,17,885 gms of yarn <span className="text-xl text-[#8C7A4E]">~ 118 kg of yarn</span>
                    </p>
                    
                    <div className="space-y-3 bg-gray-50 p-6 rounded font-mono text-sm sm:text-base border border-gray-200">
                      <p>Energy consumed by Manual Charkha = 0.283 kWh/ kg yarn * 118 kg yarn = <strong>33.4 kWh</strong></p>
                      <p>Energy consumed during Mill Spinning = 5.505 kWh/ kg yarn * 118 kg yarn = <strong>649.59 kWh</strong></p>
                      <div className="pt-4 mt-4 border-t border-gray-300">
                        <p className="font-bold text-lg text-gray-900">Energy saved by using Khadi spun yarn over Mill Spun = 616.2 kWh <span className="text-[#8C7A4E] text-2xl ml-2">~ 616 kWh</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. GHG EMISSIONS */}
                <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">2. GHG EMISSIONS</h3>
                  <p className="font-semibold text-lg">GHG EMISSIONS = ENERGY CONSUMED * GRID EMISSION FACTOR</p>
                  <div className="space-y-2 text-gray-700">
                    <p>India grid emission factor (0.7 - 0.9 kg CO₂ e/kWh)</p>
                    <p>Use an average emission factor of 0.8 kg CO₂ e/kWh</p>
                    
                    <div className="py-6 font-mono text-sm sm:text-base space-y-3 bg-gray-50 p-6 rounded border border-gray-200 mt-6">
                      <p>Handspun GHG Emissions = 0.283 kWh/ kg yarn * 0.8 kg CO₂ e/kWh = <strong>0.2264 kg CO₂ e/ kg yarn</strong></p>
                      <p>Millspun GHG Emissions = 5.505 kWh/ kg yarn * 0.8 kg CO₂ e/kWh = <strong>4.404 kg CO₂ e/ kg yarn</strong></p>
                      <p className="font-bold pt-4 border-t border-gray-300 mt-4 text-[#8C7A4E] text-lg">Savings in GHG Emissions of Handspun over Millspun = (4.404 - 0.2264)/ 4.404 = 94.859 ~95%</p>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <p className="font-semibold text-lg mb-4">For our total yarn consumption of ~118 kg</p>
                    <div className="space-y-3 text-gray-700 bg-gray-50 p-6 rounded border border-gray-200 font-mono text-sm sm:text-base">
                      <p>Handspun GHG Emissions = 0.283 kWh/ kg yarn * 118 kg yarn * 0.8 kg CO₂ e/kWh = <strong>26.72 kg CO₂ e</strong></p>
                      <p>Millspun GHG Emissions = 5.505 kWh/ kg yarn * 118 kg yarn * 0.8 kg CO₂ e/kWh = <strong>519.67 kg CO₂ e</strong></p>
                    </div>
                    <div className="bg-[#f0ece1] p-6 rounded-lg text-xl font-bold text-center text-[#5c4a1e] shadow-inner mt-6 leading-relaxed">
                      Net savings in GHG Emissions by using Manual Charkha over Mill Spun yarn<br/>
                      = (519.67 - 26.72) ~ 492.95 kg CO₂ e <span className="text-[#8C7A4E] text-3xl ml-4 block mt-4">~ 0.5 tonnes CO₂ e</span>
                    </div>
                  </div>
                </div>

                {/* 3. WATER CONSUMPTION */}
                <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">3. WATER CONSUMPTION</h3>
                  
                  <div className="overflow-x-auto my-8 border border-gray-300 rounded shadow-sm">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-900 text-sm md:text-base">
                          <th className="border border-gray-300 p-4 font-bold uppercase">Process</th>
                          <th className="border border-gray-300 p-4 font-bold">MANUAL CHARKHA<br/><span className="text-sm font-normal">(L/ KG YARN)</span></th>
                          <th className="border border-gray-300 p-4 font-bold">AMBAR CHARKHA<br/><span className="text-sm font-normal">(L/ KG YARN)</span></th>
                          <th className="border border-gray-300 p-4 font-bold">SOLAR CHARKHA<br/><span className="text-sm font-normal">(L/ KG YARN)</span></th>
                          <th className="border border-gray-300 p-4 font-bold bg-[#e6f2eb]">MILL SPUN YARN<br/><span className="text-sm font-normal">(L/ KG YARN)</span></th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800 text-sm md:text-base font-medium">
                        <tr>
                          <td className="border border-gray-300 p-4 bg-white font-bold text-left">CARDING</td>
                          <td className="border border-gray-300 p-4 bg-white">0 - 0.05</td>
                          <td className="border border-gray-300 p-4 bg-white">0.2 - 1.0</td>
                          <td className="border border-gray-300 p-4 bg-white">0.3 - 1.0</td>
                          <td className="border border-gray-300 p-4 bg-[#f8fdf9]">3.0 - 8.0</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 bg-white font-bold text-left">SLIVER/ PUNI PREP</td>
                          <td className="border border-gray-300 p-4 bg-white">0 - 0.2</td>
                          <td className="border border-gray-300 p-4 bg-white">0.1 - 0.5</td>
                          <td className="border border-gray-300 p-4 bg-white">0.1 - 0.5</td>
                          <td className="border border-gray-300 p-4 bg-[#f8fdf9]">2.0 - 6.0<br/><span className="text-xs text-gray-600 block mt-1">(DRAWFRAME & ROVING)</span></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 bg-white font-bold text-left">YARN SPINNING</td>
                          <td className="border border-gray-300 p-4 bg-white">0 - 0.3</td>
                          <td className="border border-gray-300 p-4 bg-white">0.5 - 2.0</td>
                          <td className="border border-gray-300 p-4 bg-white">0.8 - 2.5</td>
                          <td className="border border-gray-300 p-4 bg-[#f8fdf9]">5.0 - 15.0</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 bg-white font-bold text-left">AC/ HUMIDIFICATION</td>
                          <td className="border border-gray-300 p-4 bg-white text-gray-400">NA</td>
                          <td className="border border-gray-300 p-4 bg-white text-gray-400">NA</td>
                          <td className="border border-gray-300 p-4 bg-white text-gray-400">NA</td>
                          <td className="border border-gray-300 p-4 bg-[#f8fdf9]">10.0 - 25.0</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-4 bg-white font-bold text-left">CLEANING & CONDITIONING</td>
                          <td className="border border-gray-300 p-4 bg-white">0.5 - 2.0</td>
                          <td className="border border-gray-300 p-4 bg-white">1.0 - 3.0</td>
                          <td className="border border-gray-300 p-4 bg-white">1.0 - 3.0</td>
                          <td className="border border-gray-300 p-4 bg-[#f8fdf9]">3.0 - 10.0</td>
                        </tr>
                        <tr className="bg-gray-50 border-t-2 border-gray-400">
                          <td className="border border-gray-300 p-5 font-extrabold text-left text-lg">TOTAL</td>
                          <td className="border border-gray-300 p-5 font-bold text-lg">0.5 - 2.55</td>
                          <td className="border border-gray-300 p-5 font-bold text-lg">1.8 - 6.5</td>
                          <td className="border border-gray-300 p-5 font-bold text-lg">2.2 - 7.0</td>
                          <td className="border border-gray-300 p-5 font-bold text-lg text-[#2a5c3d] bg-[#e6f2eb]">23.0 - 64.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-4 text-gray-700 leading-relaxed bg-gray-50 p-6 border border-gray-200 rounded">
                    <p>With the khadi process increasingly using ambar charkha and solar power for spinning and yarn making, assume the range of water consumption for manual charka <strong>~ 0.5 - 7.0 L /kg yarn</strong> versus the water consumed during mill spinning <strong>~ 23.0 - 64.0 L/ kg yarn</strong></p>
                    <p>Assume the average values for manual charkha and mill spun yarn at <strong>3.75 L/ kg yarn and 43.5 L/ kg of yarn</strong>, respectively.</p>
                    <p>The Net water savings of hand charkha over mill spun yarn is <strong>39.75 L/ kg yarn</strong>.</p>
                    <p className="font-bold text-lg text-[#4a8eb5]">% Water Savings = (43.5 - 3.75)/ 43.5 ~ 91.37 %</p>
                    <p className="font-bold text-xl mt-4 border-t border-gray-300 pt-4">Water consumption savings that can be achieved by khadi spun yarn over mill spun yarn is <span className="text-[#4a8eb5]">~91%</span></p>
                  </div>

                  <div className="pt-6">
                    <p className="font-semibold text-lg text-gray-900 mb-4">
                      For our total consumption of 813 m of khadi thus far, assuming a 140 - 150 gsm fabric and 1 m panna. The total fabric weight is 145 grams/ sq m * 813 m * 1 m (panna) = 1,17,885 gms of yarn <span className="text-[#4a8eb5] font-bold">~ 118 kg of yarn</span>
                    </p>
                    <div className="space-y-3 bg-[#eef6f9] p-6 rounded border border-[#cbe1ed] text-lg font-medium text-[#2d5f7a]">
                      <p>Water consumed by Manual Charkha = 3.75 L/ kg yarn * 118 kg yarn = <strong>442.5 L</strong></p>
                      <p>Water consumed during Mill Spinning = 43.5 L/ kg yarn * 118 kg yarn = <strong>5133 L</strong></p>
                      <p className="text-2xl font-bold pt-4 mt-4 border-t border-[#cbe1ed]">Net savings of water consumption with khadi over mill spun = 4,690.5 L</p>
                    </div>
                  </div>
                </div>

                {/* 4. CHEMICAL USE & POLLUTION LOAD */}
                <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
                  
                  <div className="space-y-4 text-justify">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">4. CHEMICAL USE & POLLUTION LOAD</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Handspun khadi yarn produced using Ambar charkhas and solar-powered spinning systems relies on predominantly mechanical processes that require minimal chemical inputs and generate negligible operational pollution. Fibre preparation, sliver formation, and spinning are largely dry processes, eliminating the need for lubricants, synthetic sizing agents, process chemicals, and extensive cleaning systems typically associated with industrial production.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-semibold">
                      As a result, air emissions, wastewater generation, and chemical discharge are inherently low, with environmental impacts largely limited to upstream fibre cultivation.
                    </p>
                    <p className="text-gray-700 leading-relaxed pt-4">
                      Conventional mill-spun cotton yarn is produced through highly mechanised operations that depend on lubricants, machine oils, cleaning agents, humidification systems, and other process inputs to maintain production efficiency and yarn quality. While the spinning process itself is not highly chemical intensive compared with dyeing or finishing, industrial-scale operations generate greater pollution loads through energy consumption, airborne fibre dust, wastewater from maintenance and cleaning activities, oil-contaminated waste streams, and higher indirect emissions associated with centralised manufacturing infrastructure.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-semibold">
                      Consequently, conventional mill-spun yarn generally carries a higher operational pollution footprint than handspun khadi yarn.
                    </p>
                    <div className="font-bold text-lg bg-gray-50 p-4 rounded inline-block text-[#2a5c3d] border border-[#2a5c3d] mt-4">Result: 70–85 % reduction in airborne pollutants.</div>
                  </div>

                  {/* 5. FABRIC PERFORMANCE */}
                  <div className="space-y-4 text-justify pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">5. FABRIC PERFORMANCE</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Handspun khadi fabric features naturally irregular yarns that create microscopic air pockets, enhancing breathability, moisture management, acting as natural insulators, providing thermal comfort (particularly in warm and humid climates), and increased softness post wash cycles. This unique structure provides each khadi garment a distinctive handcrafted texture.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Conventional mill-spun powerloom cotton fabric uses highly uniform yarns and mechanised weaving, delivering consistency and durability but with comparatively lower airflow, thermal regulation, and moisture dispersion. The result is a smoother, more standardised fabric with fewer natural comfort-enhancing characteristics.
                    </p>
                  </div>

                  {/* 6. SOCIAL & CULTURAL SIGNIFICANCE */}
                  <div className="space-y-4 text-justify pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">6. SOCIAL & CULTURAL SIGNIFICANCE (RURAL EMPOWERMENT)</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Handspun khadi fabric represents India's living craft heritage. Every metre supports decentralised artisan livelihoods financially empowers women through dignified and flexible home-based employment, and preserves traditional spinning and weaving skills passed down through generations. Khadi fabric weaves generational cultural continuity, community impact, and timeless craftsmanship into every garment.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Conventional mill-spun cotton fabric is produced through centralised, industrial manufacturing systems that generate large-scale employment but offer limited opportunities for home-based work and traditional craft preservation. While women participate across the textile value chain, employment is generally concentrated within factory settings, and the production process contributes less directly to the preservation of regional textile traditions, artisan skills, and community-based economic development.
                    </p>
                  </div>

                  {/* 7. SOCIAL EMPOWERMENT */}
                  <div className="space-y-4 text-justify pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">7. SOCIAL EMPOWERMENT</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Handloom production is labor-intensive and decentralized, supporting rural livelihoods. Handloom also recognises the workers as skilled artisans that are preserving a cultural heritage. Powerloom production is capital-intensive with lower employment per unit output. The workers are seen as menial labourers.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Handspun khadi is a livelihood ecosystem. Crafted through labour-intensive spinning and weaving processes, it creates up to 2–4 times more employment per metre than conventional mill-spun textiles, sustaining artisan communities, empowering women, and preserving generations of textile heritage. Every garment embodies not only exceptional craftsmanship, but also a deeper investment in people and place.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-semibold">
                      In contrast Powerloom production is capital-intensive with lower employment per unit output. The workers are only valued as menial labourers.
                    </p>
                    <div className="font-bold text-lg bg-gray-50 p-4 rounded inline-block text-[#c57a4e] border border-[#c57a4e] mt-4">Result: 2–4× higher employment generation per meter of fabric.</div>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="bg-[#fcf7e6] p-10 rounded-xl shadow-md border-2 border-[#8C7A4E] text-center space-y-4">
                  <h3 className="text-3xl font-serif text-[#5c4a1e]">Key Conclusion</h3>
                  <p className="text-lg font-bold text-gray-900 leading-relaxed max-w-5xl mx-auto underline underline-offset-4 decoration-[#8C7A4E] decoration-2">
                    Compared to conventional Indian mill-spun yarn, khadi spinning using manual, Ambar Charkha, and Solar Charkha systems virtually eliminates process chemical consumption and hazardous waste generation while reducing airborne pollution and energy-related emissions by over 90%, making it one of the lowest-impact yarn production systems in the Indian textile sector.
                  </p>
                </div>

              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
