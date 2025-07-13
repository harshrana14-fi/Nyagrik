'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaLinkedin,} from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Suteekshn Manchanda',
    role: 'Founder',
    image: '/suteekshn.jpeg',
    description:
      'Suteekshn brings visionary leadership to Nyagrik. With deep insight into India’s legal system, he founded Nyagrik to simplify justice through technology and expand legal access across all regions.',
    linkedin: 'https://www.linkedin.com/in/suteekshn-manchanda-936b16330/',
  },
  {
    name: 'Shubham Solanki',
    role: 'Co-Founder',
    image: '/shubham.jpeg',
    description:
      'With a background in business and law, Shubham plays a key role in strategy and partnerships. He ensures Nyagrik aligns with real-world legal needs while remaining innovative and scalable.',
    linkedin: 'https://www.linkedin.com/in/shubham-solanki-902331321/',
  },
  {
    name: 'Harsh Rana',
    role: 'Chief Technical Officer (CTO)',
    image: '/.jpeg',
    description:
      'Harsh leads Nyagrik’s technology stack. He architects solutions that ensure performance, reliability, and user-centricity. His vision combines legal-tech innovation with top-tier engineering, turning complex legal processes into seamless digital experiences.',
    linkedin: 'https://www.linkedin.com/in/harsh-rana-17208634a/',
  },
  {
    name: 'Krish Vishwakarma',
    role: 'Chief Operating Officer (COO)',
    image: '/krish.jpg',
    description:
      'Krish is the backbone of Nyagrik’s daily operations. He ensures smooth client-lawyer coordination, legal service workflows, and efficient implementation of new features.',
    linkedin: 'https://www.linkedin.com/in/krish-vishwakarma-46481527a/',
  },
];

const PeoplePage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/team.webp"
          alt="Nyagrik Team"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold"
          >
            Our People
          </motion.h1>
          <p className="mt-2 text-lg">Meet the team behind Nyagrik’s mission of accessible justice.</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid gap-12 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full md:w-[300px] h-[300px] object-cover"
                />
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                    <p className="mt-3 text-sm text-gray-700 leading-relaxed">{member.description}</p>
                  </div>
                  {/* Social Links */}
                  <div className="mt-4 flex space-x-4">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <FaLinkedin className="text-blue-700 hover:text-blue-900 w-5 h-5 transition" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PeoplePage;
