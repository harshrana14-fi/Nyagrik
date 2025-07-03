import Link from 'next/link'
import Image from 'next/image'
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-14 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo and About */}
        <div>
          <div className="flex items-center mb-4">
            <Image src="/nyaylogo.jpg" alt="Nyay Logo" width={40} height={40} />
            <span className="text-xl font-semibold text-white ml-3">Nyay</span>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Nyay is an AI-powered legal-tech platform bridging clients, lawyers, and interns to deliver smart, accessible, and efficient justice.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
              <FaLinkedin className="text-xl hover:text-white transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
              <FaTwitter className="text-xl hover:text-white transition" />
            </Link>
            <Link href="https://github.com" target="_blank" aria-label="GitHub">
              <FaGithub className="text-xl hover:text-white transition" />
            </Link>
          </div>
        </div>

        {/* Middle: Navigation - matching navbar */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/#about" className="hover:text-white">About</Link></li>
              <li><Link href="/Eexpertise" className="hover:text-white">Expertise</Link></li>
              <li><Link href="/#services" className="hover:text-white">Services</Link></li>
              <li><Link href="/#contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/login" className="hover:text-white">Login</Link></li>
              <li><Link href="/register" className="hover:text-white">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Right: Subscribe & Language */}
        <div>
          <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-sm text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded"
            >
              Subscribe
            </button>
          </form>

          <div className="mt-6">
            <label htmlFor="lang" className="block text-sm mb-2 text-white font-medium">
              Language
            </label>
            <select
              id="lang"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-sm text-white rounded"
            >
              <option>English</option>
              <option>हिंदी</option>
              <option>বাংলা</option>
              <option>தமிழ்</option>
              <option>తెలుగు</option>
              <option>मराठी</option>
              <option>ગુજરાતી</option>
              <option>ಕನ್ನಡ</option>
              <option>മലയാളം</option>
              <option>ਪੰਜਾਬੀ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Nyay. All rights reserved.
      </div>
    </footer>
  )
}