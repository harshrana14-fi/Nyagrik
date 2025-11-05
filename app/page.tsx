'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Scale, Users, Award, Shield, BookOpen, Eye, Clock, Star, Phone, Building2, Gavel, FileText, Heart, Home, Calculator } from 'lucide-react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


const NyayWebsite = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [, setActiveSection] = useState('home');
  const [currentImage, setCurrentImage] = useState(0);

  const heroSlides = [
    {
      image: "/legalbg1.jpg",
      title: "NYAY",
      subtitle: "Digital Bharat ke Liye Digital Nyay",
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
  }, [heroSlides.length]);

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
    { title: "Corporate Law", description: "Comprehensive corporate legal solutions for businesses of all sizes", icon: Building2 },
    { title: "Criminal Defense", description: "Expert criminal defense representation with proven track record", icon: Gavel },
    { title: "Civil Litigation", description: "Strategic litigation services for complex civil matters", icon: FileText },
    { title: "Family Law", description: "Compassionate legal support for family-related legal issues", icon: Heart },
    { title: "Property Law", description: "Complete property and real estate legal services", icon: Home },
    { title: "Tax Consultation", description: "Expert tax advice and compliance solutions", icon: Calculator },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
      <Navbar/>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Carousel */}
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

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Content Left Aligned */}
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


 {/* About Us */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">About NYAY</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Founded on principles of justice and excellence, NYAY represents the pinnacle of legal expertise combined with modern innovation.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/30">
                  <Scale className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Foundation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Built on decades of legal excellence, NYAY has established itself as a premier legal institution. We combine traditional legal wisdom with innovative approaches to deliver unparalleled legal services.
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/30">
                  <Users className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our diverse team of experienced attorneys, paralegals, and legal experts work collaboratively to ensure every client receives personalized attention and the highest quality legal representation.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-2xl text-white">
                  <h3 className="text-3xl font-bold mb-6">Why Choose NYAY?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-yellow-300" />
                      <span>Award-winning legal expertise</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-green-300" />
                      <span>100% client confidentiality</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <BookOpen className="w-6 h-6 text-blue-300" />
                      <span>Comprehensive legal solutions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-pink-300" />
                      <span>24/7 client support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Expertise */}
      <section id="expertise" className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 ${isVisible.expertise ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Legal Expertise</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive legal expertise spans across multiple domains of law, ensuring complete legal coverage for all your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item}</h3>
                    <p className="text-gray-600">Expert legal counsel and representation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Motive */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8">Our Motive</h2>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 rounded-3xl shadow-2xl text-white max-w-4xl mx-auto">
              <p className="text-2xl font-light leading-relaxed mb-6">
                &quot;To democratize access to quality legal services while upholding the highest standards of justice, integrity, and professional excellence.&quot;
              </p>
              <p className="text-lg opacity-90">
                We believe that everyone deserves exceptional legal representation, regardless of their background or circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Commitments */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Client Commitments</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Transparency", desc: "Clear communication at every step", icon: Eye },
              { title: "Reliability", desc: "Consistent and dependable service", icon: Clock },
              { title: "Excellence", desc: "Highest quality legal representation", icon: Star },
              { title: "Accessibility", desc: "Always available when you need us", icon: Phone }
            ].map((commitment, index) => {
              const IconComponent = commitment.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{commitment.title}</h3>
                  <p className="text-gray-600">{commitment.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NYAY Edge */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">The NYAY Edge</h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Technology-Driven</h3>
              <p className="text-gray-600">Leveraging cutting-edge legal technology for efficient case management and client communication.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Client-Centric</h3>
              <p className="text-gray-600">Every decision and strategy is crafted with your best interests and desired outcomes in mind.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Results-Oriented</h3>
              <p className="text-gray-600">Focused on achieving measurable results and favorable outcomes for every client we represent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all duration-1000 ${isVisible.services ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive legal services tailored to meet your specific needs with unmatched expertise and dedication.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/40 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors group-hover:underline">
                        Learn More →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NyayWebsite;
