'use client';

import { useState } from 'react';
import { Search, Star, Clock, MapPin, Phone, Mail, MessageCircle, Filter, Award, BookOpen, Users, Calendar, CheckCircle } from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  image?: string;
  acceptedCases: string[];
  location: string;
  languages: string[];
  consultationFee: number;
  responseTime: string;
  bio: string;
  education: string[];
  certifications: string[];
  successRate: number;
  casesHandled: number;
  availability: 'Available' | 'Busy' | 'Offline';
  phone: string;
  email: string;
  priceRange: 'Budget' | 'Mid-range' | 'Premium';
}

const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Adv. Lawyer 1',
    specialization: 'Family Law',
    experience: 8,
    rating: 4.8,
    reviewCount: 156,
    image: '/images/lawyer1.jpg',
    acceptedCases: ['Divorce Case', 'Child Custody', 'Alimony Dispute', 'Domestic Violence', 'Adoption'],
    location: 'New Delhi, India',
    languages: ['Hindi', 'English', 'Punjabi'],
    consultationFee: 1500,
    responseTime: '2 hours',
    bio: 'Specialized in family law with a compassionate approach. Successfully handled over 200 family disputes with high client satisfaction.',
    education: ['LLB from Delhi University', 'LLM Family Law from JNU'],
    certifications: ['Bar Council of India', 'Family Mediation Certificate'],
    successRate: 89,
    casesHandled: 234,
    availability: 'Available',
    phone: '+91-9876543210',
    email: 'lawyer1r@nyagrik.com',
    priceRange: 'Mid-range'
  },
  {
    id: '2',
    name: 'Adv. Lawyer 2',
    specialization: 'Criminal Law',
    experience: 12,
    rating: 4.9,
    reviewCount: 203,
    image: '/images/lawyer2.jpg',
    acceptedCases: ['Theft Case', 'Assault', 'Fraud Investigation', 'Cybercrime', 'White Collar Crime'],
    location: 'Mumbai, India',
    languages: ['Hindi', 'English', 'Marathi'],
    consultationFee: 2000,
    responseTime: '1 hour',
    bio: 'Expert criminal lawyer with extensive experience in high-profile cases. Known for strategic defense and thorough case preparation.',
    education: ['LLB from Mumbai University', 'LLM Criminal Law from ILS'],
    certifications: ['Bar Council of Maharashtra', 'Criminal Law Specialist'],
    successRate: 92,
    casesHandled: 189,
    availability: 'Available',
    phone: '+91-9876543211',
    email: 'Lawyer2@gmail.com',
    priceRange: 'Premium'
  },
  {
    id: '3',
    name: 'Adv. Lawyer 3',
    specialization: 'Civil Law',
    experience: 6,
    rating: 4.7,
    reviewCount: 98,
    image: '/images/lawyer3.jpg',
    acceptedCases: ['Property Dispute', 'Land Registration', 'Rent Agreement', 'Contract Disputes', 'Consumer Issues'],
    location: 'Bangalore, India',
    languages: ['Hindi', 'English', 'Kannada'],
    consultationFee: 1200,
    responseTime: '3 hours',
    bio: 'Young and dynamic civil lawyer with modern approach to legal solutions. Specializes in property and commercial disputes.',
    education: ['LLB from Bangalore University', 'Diploma in Corporate Law'],
    certifications: ['Bar Council of Karnataka', 'Property Law Certificate'],
    successRate: 85,
    casesHandled: 156,
    availability: 'Busy',
    phone: '+91-9876543212',
    email: 'Lawyer3@gmail.com',
    priceRange: 'Budget'
  },
  {
    id: '4',
    name: 'Adv. Lawyer 4',
    specialization: 'Corporate Law',
    experience: 10,
    rating: 4.6,
    reviewCount: 134,
    image: '/images/lawyer4.jpg',
    acceptedCases: ['Company Registration', 'Mergers & Acquisitions', 'Compliance', 'Employment Law', 'IPR'],
    location: 'Ahmedabad, India',
    languages: ['Hindi', 'English', 'Gujarati'],
    consultationFee: 2500,
    responseTime: '4 hours',
    bio: 'Corporate law expert with experience in startup ecosystem and large corporate transactions. Trusted advisor for business legal matters.',
    education: ['LLB from Gujarat University', 'LLM Corporate Law from NLIU'],
    certifications: ['Bar Council of Gujarat', 'Company Secretary'],
    successRate: 94,
    casesHandled: 278,
    availability: 'Available',
    phone: '+91-9876543213',
    email: 'Lawyer4@gmail.com',
    priceRange: 'Premium'
  },
  {
    id: '5',
    name: 'Adv. Lawyer 5',
    specialization: 'Divorce Law',
    experience: 7,
    rating: 4.5,
    reviewCount: 87,
    image: '/images/lawyer5.jpg',
    acceptedCases: ['Visa Applications', 'Work Permits', 'Citizenship', 'Deportation Defense', 'Green Card'],
    location: 'Hyderabad, India',
    languages: ['Hindi', 'English', 'Telugu'],
    consultationFee: 1800,
    responseTime: '2 hours',
    bio: 'Immigration specialist with successful track record in visa applications and citizenship matters. Up-to-date with latest immigration policies.',
    education: ['LLB from Osmania University', 'Certificate in Immigration Law'],
    certifications: ['Bar Council of Telangana', 'Immigration Law Specialist'],
    successRate: 88,
    casesHandled: 167,
    availability: 'Available',
    phone: '+91-9876543214',
    email: 'Lawyer5@gmail.com',
    priceRange: 'Mid-range'
  },
  {
    id: '6',
    name: 'Adv. Lawyer 6',
    specialization: 'Tax Law',
    experience: 15,
    rating: 4.8,
    reviewCount: 178,
    image: '/images/lawyer6.jpg',
    acceptedCases: ['Income Tax', 'GST Disputes', 'Tax Planning', 'Appeals', 'Corporate Tax'],
    location: 'Kolkata, India',
    languages: ['Hindi', 'English', 'Bengali'],
    consultationFee: 2200,
    responseTime: '1 hour',
    bio: 'Senior tax lawyer with deep expertise in direct and indirect taxation. Handles complex tax disputes and provides strategic tax planning.',
    education: ['LLB from Calcutta University', 'LLM Tax Law', 'CA'],
    certifications: ['Bar Council of West Bengal', 'Tax Law Expert'],
    successRate: 91,
    casesHandled: 312,
    availability: 'Offline',
    phone: '+91-9876543215',
    email: 'Lawyer6@gmail.com',
    priceRange: 'Premium'
  }
];

const specializations = ['All', 'Family Law', 'Criminal Law', 'Civil Law', 'Corporate Law', 'Immigration Law', 'Tax Law'];
const locations = ['All', 'New Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad', 'Hyderabad', 'Kolkata'];
const priceRanges = ['All', 'Budget', 'Mid-range', 'Premium'];

export default function LawyersPage() {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLawyers = mockLawyers
    .filter((lawyer) => {
      const matchesSearch = lawyer.name.toLowerCase().includes(search.toLowerCase()) ||
                           lawyer.specialization.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialization = selectedSpecialization === 'All' || lawyer.specialization === selectedSpecialization;
      const matchesLocation = selectedLocation === 'All' || lawyer.location.includes(selectedLocation);
      const matchesPriceRange = selectedPriceRange === 'All' || lawyer.priceRange === selectedPriceRange;
      
      return matchesSearch && matchesSpecialization && matchesLocation && matchesPriceRange;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'price':
          return a.consultationFee - b.consultationFee;
        default:
          return 0;
      }
    });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Busy':
        return 'text-yellow-600 bg-yellow-100';
      case 'Offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Budget':
        return 'text-green-600 bg-green-100';
      case 'Mid-range':
        return 'text-blue-600 bg-blue-100';
      case 'Premium':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="text-indigo-600" size={40} />
                Find Expert Lawyers
              </h1>
              <p className="text-gray-600 mt-2">Connect with verified legal professionals across India</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Trusted by</p>
              <p className="text-2xl font-bold text-indigo-600">10,000+ clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredLawyers.length} lawyers {search && `for "${search}"`}
          </p>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-200"
              onClick={() => setSelectedLawyer(lawyer)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {lawyer.name.split(' ')[1]?.[0] || 'L'}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(lawyer.availability)}`}>
                      {lawyer.availability}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriceRangeColor(lawyer.priceRange)}`}>
                      {lawyer.priceRange}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">{lawyer.name}</h3>
                <p className="text-indigo-600 font-medium mb-2">{lawyer.specialization}</p>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {lawyer.experience}+ yrs
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {lawyer.location.split(',')[0]}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} fill="currentColor" />
                    <span className="font-medium">{lawyer.rating}</span>
                    <span className="text-gray-500 text-sm">({lawyer.reviewCount})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Consultation</p>
                    <p className="font-bold text-indigo-600">₹{lawyer.consultationFee}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <CheckCircle size={12} className="text-green-500" />
                    {lawyer.successRate}% success
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <BookOpen size={12} />
                    {lawyer.casesHandled} cases
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle connect action
                    }}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    Connect Now
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle chat action
                    }}
                    className="p-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No lawyers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedLawyer.name.split(' ')[1]?.[0] || 'L'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{selectedLawyer.name}</h2>
                    <p className="text-indigo-600 font-medium text-lg">{selectedLawyer.specialization}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(selectedLawyer.availability)}`}>
                        {selectedLawyer.availability}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span className="text-sm text-gray-600">Responds in {selectedLawyer.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="text-indigo-600" size={20} />
                      Professional Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{selectedLawyer.experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-400" size={16} fill="currentColor" />
                          <span className="font-medium">{selectedLawyer.rating}</span>
                          <span className="text-gray-500">({selectedLawyer.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium text-green-600">{selectedLawyer.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cases Handled:</span>
                        <span className="font-medium">{selectedLawyer.casesHandled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="font-medium text-indigo-600">₹{selectedLawyer.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedLawyer.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Education</h3>
                    <ul className="space-y-1">
                      {selectedLawyer.education.map((edu, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                          <BookOpen size={14} className="text-indigo-600" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLawyer.languages.map((lang, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Specialization Areas</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedLawyer.acceptedCases.map((caseType, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm">{caseType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                    <ul className="space-y-1">
                      {selectedLawyer.certifications.map((cert, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                          <Award size={14} className="text-indigo-600" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-600" />
                        <span className="text-sm">{selectedLawyer.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-600" />
                        <span className="text-sm">{selectedLawyer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-600" />
                        <span className="text-sm">{selectedLawyer.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        // Handle connect action
                        alert(`Connecting with ${selectedLawyer.name}...`);
                      }}
                      className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Connect Now
                    </button>
                    <button
                      onClick={() => {
                        // Handle chat action
                        alert(`Starting chat with ${selectedLawyer.name}...`);
                      }}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Start Chat
                    </button>
                    <button
                      onClick={() => {
                        // Handle schedule consultation
                        alert(`Scheduling consultation with ${selectedLawyer.name}...`);
                      }}
                      className="w-full border border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-50 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} />
                      Schedule Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
