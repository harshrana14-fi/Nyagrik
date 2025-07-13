
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Expertise", href: "/#expertise" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Our People", href: "/people" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/nyagriklogo.png"
              alt="Nyay Logo"
              width={50}
              height={50}
            />
            <span className="text-2xl font-bold text-indigo-700 tracking-wide">
              न्याय
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
       <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative font-medium text-lg transition-colors duration-200 group ${
                activeSection === item.href.substring(1)
                  ? "text-indigo-600"
                  : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              {item.label}
              <span
                className="absolute left-0 -bottom-1 w-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full group-hover:w-full transition-all duration-300 ease-out"
                style={{ content: '""', display: "block" }}
              />
            </a>
          ))}
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md px-4 py-6 shadow-lg space-y-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setNavOpen(false)}
              className={`block font-medium transition-colors duration-200 ${
                activeSection === item.href.substring(1)
                  ? "text-indigo-600"
                  : "text-gray-700 hover:text-indigo-500"
              }`}
            >
              {item.label}
            </a>
          ))}
          <hr className="my-2 border-gray-200" />
          <Link
            href="/login"
            onClick={() => setNavOpen(false)}
            className="block text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setNavOpen(false)}
            className="block bg-indigo-600 text-white text-center py-2 rounded-md font-semibold hover:bg-indigo-700"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
