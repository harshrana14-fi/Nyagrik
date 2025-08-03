'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaLinkedin, } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const teamMembers = [
  {
    name: 'Suteekshn Manchanda',
    role: 'Founder',
    image: '/suteekshn.jpeg',
    description:
      'With a solid foundation in both technology and business, Suteekshn is the visionary force behind Nyagrik. He conceptualized the platform to simplify and democratize legal services, aiming to make them more approachable and accessible for all. His strategic mindset, clarity of vision, and active leadership continue to guide the team in building impactful, tech-enabled legal solutions.',
    linkedin: 'https://www.linkedin.com/in/suteekshn-manchanda-936b16330/',
  },
  {
    name: 'Shubham Solanki',
    role: 'Co-Founder',
    image: '/shubham.jpeg',
    description:
      'Shubham plays a key role in shaping Nyagrik’s overall strategy and technological progress. As Co-Founder, he contributes to development workflows, ensures smooth tech operations, and leads the integration of AI-driven tools. His focus on scalable impact and innovation helps maintain Nyagrik’s user-first approach and long-term growth.',
    linkedin: 'https://www.linkedin.com/in/shubham-solanki-902331321/',
  },
  {
    name: 'Harsh Rana',
    role: 'Chief Technical Officer (CTO)',
    image: '/harsh.jpg',
    description:
      'Harsh is the driving force behind Nyagrik’s infrastructure, leading both frontend and backend systems with a full-stack approach. He is instrumental in translating complex legal workflows into secure, scalable, and user-centric digital experiences. His strong technical foundation and product thinking ensure the platform stays innovative and aligned with the company’s mission.',
    linkedin: 'https://www.linkedin.com/in/harsh-rana-17208634a/',
  },
  {
    name: 'Krish Vishwakarma',
    role: 'Chief Operating Officer (COO)',
    image: '/krishvish.jpg',
    description:
      'Krish ensures the seamless execution of day-to-day operations at Nyagrik. He oversees internal coordination, manages team communication, and plays a crucial role in revenue modeling and user acquisition. With strong interpersonal skills and operational insight, Krish helps convert strategic ideas into actionable outcomes.',
    linkedin: 'https://www.linkedin.com/in/krish-vishwakarma-46481527a/',
  },
];


const PeoplePage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar />
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