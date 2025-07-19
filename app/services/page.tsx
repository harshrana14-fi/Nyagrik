"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar"; // update if path differs

const services = [
  {
    title: "Corporate Law",
    description: "Comprehensive corporate legal solutions for businesses of all sizes",
    icon: "🏢",
    href: "https://www.mca.gov.in/",
  },
  {
    title: "Criminal Defense",
    description: "Expert criminal defense representation with proven track record",
    icon: "⚖️",
    href: "https://indiankanoon.org/search/?formInput=criminal%20law",
  },
  {
    title: "Civil Litigation",
    description: "Strategic litigation services for complex civil matters",
    icon: "📋",
    href: "https://indiankanoon.org/search/?formInput=civil+law",
  },
  {
    title: "Family Law",
    description: "Compassionate legal support for family-related legal issues",
    icon: "👨‍👩‍👧‍👦",
    href: "https://indiankanoon.org/search/?formInput=family+law",
  },
  {
    title: "Property Law",
    description: "Complete property and real estate legal services",
    icon: "🏠",
    href: "https://indiankanoon.org/search/?formInput=property+law",
  },
  {
    title: "Tax Consultation",
    description: "Expert tax advice and compliance solutions",
    icon: "💼",
    href: "https://incometaxindia.gov.in/",
  },
];

const ExploreServicesPage = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <div
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/servbg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive legal services tailored to meet your specific needs
            with unmatched expertise and dedication.
          </p>
        </div>
      </div>

      {/* Cards Section Below */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors group-hover:underline"
                  >
                   🔗 Learn More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="mt-8 mb-12 text-center">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Homepage
        </button>
      </div>
    </>
  );
};

export default ExploreServicesPage;
