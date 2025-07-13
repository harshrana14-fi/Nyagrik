'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Scale, Users, Award, Shield, BookOpen } from 'lucide-react';
import Link from 'next/link';

const NyagrikWebsite = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [, setActiveSection] = useState('home');
  const [currentImage, setCurrentImage] = useState(0);

  const heroSlides = [
    {
      image: "/legalbg1.jpg",
      title: "Nyagrik",
      subtitle: "Digital nagrik ke liye Digital Nyay",
      description:
        "Your trusted legal partner delivering comprehensive solutions with integrity, expertise, and unwavering commitment to justice in every case we handle.",
    },
    {
      image: "/herobg1.jpg",
      title: "Empowering Clients",
      subtitle: "Legal Expertise with Compassion and Clarity",
      description:
        "We provide strategic legal counsel that empowers our clients to navigate even the most complex legal matters with confidence.",
    },
    {
      image: "/herobg.jpg",
      title: "Accessible Justice",
      subtitle: "Modern Legal Services for a Modern India",
      description:
        "We combine technology, talent, and trust to ensure justice is not just a privilege—but a right for every citizen.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const services = [
    { title: "Corporate Law", description: "Comprehensive corporate legal solutions for businesses of all sizes", icon: "🏢" },
    { title: "Criminal Defense", description: "Expert criminal defense representation with proven track record", icon: "⚖️" },
    { title: "Civil Litigation", description: "Strategic litigation services for complex civil matters", icon: "📋" },
    { title: "Family Law", description: "Compassionate legal support for family-related legal issues", icon: "👨‍👩‍👧‍👦" },
    { title: "Property Law", description: "Complete property and real estate legal services", icon: "🏠" },
    { title: "Tax Consultation", description: "Expert tax advice and compliance solutions", icon: "💼" },
  ];

  const expertise = [
    "Constitutional Law",
    "Commercial Disputes",
    "Intellectual Property",
    "Labor & Employment",
    "Banking & Finance",
    "Regulatory Compliance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                currentImage === index ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div className="relative z-20 px-6 sm:px-10 lg:px-24 max-w-7xl w-full">
          <div className={`max-w-2xl transform transition-all duration-1000 ${isVisible.home ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              <span className="text-indigo-300">{heroSlides[currentImage].title}</span><br />
              {heroSlides[currentImage].subtitle}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
              {heroSlides[currentImage].description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/consultation">
                <button className="group px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transform hover:scale-105 transition duration-300 shadow-xl hover:shadow-2xl">
                  Get Legal Consultation
                  <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/services">
                <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 backdrop-blur-sm">
                  Explore Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional sections like About, Services, Expertise, etc. should go here (reuse your provided code, already valid). */}
    </div>
  );
};

export default NyagrikWebsite;
