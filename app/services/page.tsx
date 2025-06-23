'use client';
import React from 'react';
import { useRouter } from 'next/navigation';


 const services = [
    { title: "Corporate Law", description: "Comprehensive corporate legal solutions for businesses of all sizes", icon: "🏢" },
    { title: "Criminal Defense", description: "Expert criminal defense representation with proven track record", icon: "⚖️" },
    { title: "Civil Litigation", description: "Strategic litigation services for complex civil matters", icon: "📋" },
    { title: "Family Law", description: "Compassionate legal support for family-related legal issues", icon: "👨‍👩‍👧‍👦" },
    { title: "Property Law", description: "Complete property and real estate legal services", icon: "🏠" },
    { title: "Tax Consultation", description: "Expert tax advice and compliance solutions", icon: "💼" },
  ];

const ExploreServicesPage = () => {
  const router = useRouter();

  return (
    <>
      <section id="services" className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="transform transition-all duration-1000">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive legal services tailored to meet your specific needs with unmatched expertise and dedication.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors group-hover:underline">
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Homepage
        </button>
      </div>
    </>
  );
};

export default ExploreServicesPage;
