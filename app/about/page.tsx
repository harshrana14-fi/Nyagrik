'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/aboutus.jpg" // ✅ Add a professional image to /public/images/
          alt="Nyagrik Team"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nyagrik</h1>
            <p className="text-lg md:text-xl">Bridging the Gap Between Law and Technology</p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            <em>&quot;Justice should not be a privilege — it should be a right.&quot;</em> <br />
            We’re committed to transforming India’s legal system by using modern tools to offer accessible, affordable, and intelligent legal support.
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-12">What We Offer</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 border border-gray-200 rounded-2xl shadow p-6 text-center"
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={60}
                  height={60}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We envision a digital legal ecosystem where justice is just a few clicks away —
              where AI empowers people, lawyers collaborate more effectively, and students learn with real-world exposure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Join Us at Nyagrik</h2>
            <p className="text-gray-600 mb-6">
              Whether you&apos;re a client, lawyer, or law student — there&apos;s a place for you at Nyagrik. Let’s build a better legal world together.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

// Feature data with icons (store icons in /public/icons/)
const features = [
  {
    title: 'Legal Consultations',
    description: 'Talk to verified lawyers for personal, civil, or corporate legal issues.',
    icon: '/client.png',
  },
  {
    title: 'AI Case Analysis',
    description: 'Upload files and receive automated legal insights & predictions.',
    icon: '/diagnostic.png',
  },
  {
    title: 'Secure File Uploads',
    description: 'Keep your legal documents encrypted and safe.',
    icon: '/file.png',
  },
  {
    title: 'Client-Lawyer Portal',
    description: 'Collaborate in real-time, track updates, and share files easily.',
    icon: '/portal.png',
  },
  {
    title: 'Law Intern Support',
    description: 'Practice, connect and learn from real-life legal scenarios.',
    icon: '/support.png',
  },
  {
    title: 'Affordable Access',
    description: 'We offer affordable solutions so legal help reaches all.',
    icon: '/affordable.png',
  },
];
