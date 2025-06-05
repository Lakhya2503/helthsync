import React, { useState } from 'react';
import Doctor_Team from '../assets/doctor_images/index';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Subscribed with:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: 'Our Services', url: '#services' },
    { name: 'Meet the Doctors', url: '#doctors' },
    { name: 'Patient Reviews', url: '#reviews' },
    { name: 'Health Blog', url: '#blog' },
    { name: 'Contact & Support', url: '#contact' },
  ];

  const features = [
    '24/7 Emergency Care',
    'Advanced Medical Equipment',
    'Certified and Experienced Doctors',
    'Online Appointments & Reports',
    'Health Insurance Support'
  ];

  return (
    <div className="relative text-white bg-[#007E85] mt-20">
      {/* Top CTA */}
      <div
        className="bg-cover bg-center bg-no-repeat h-[22rem]"
        style={{ backgroundImage: `url(${Doctor_Team.Doctors_Team})` }}
      >
        <div className="bg-gradient-to-r from-[#007E85]/90 to-[#0D1A2D]/90 w-full h-full py-20 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl leading-tight">
            Providing Quality <span className="text-yellow-400">HealthSync</span> for a Brighter and Healthy Future
          </h2>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg mt-4 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => window.location.href = '#booking'}
          >
            Book a Free Consultation
          </button>
        </div>
      </div>

      {/* Footer Main */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 bg-[#0D1A2D] text-sm text-white">
        {/* Website Info */}
        <div>
          <h3 className="font-bold text-2xl mb-3 text-yellow-400">HealthSync</h3>
          <p className="mb-4 italic text-gray-300">"Your trusted partner in healthcare excellence"</p>
          <ul className="space-y-2 text-gray-300">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-400 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors">
              <i className="fab fa-linkedin-in text-lg"></i>
            </a>
          </div>
        </div>

        {/* Sitemap */}
        <div>
          <h3 className="font-bold text-xl mb-4 text-yellow-400">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url}
                  className={`block py-1 transition-all duration-300 ${hoveredLink === index ? 'text-yellow-400 pl-2 border-l-4 border-yellow-400' : 'text-gray-300 hover:text-white'}`}
                  onMouseEnter={() => setHoveredLink(index)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Emergency Contact</h4>
            <p className="text-gray-300">+1 (555) 123-4567</p>
            <p className="text-gray-300">emergency@healthsync.com</p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="font-bold text-xl mb-4 text-yellow-400">Stay Connected</h3>
          <p className="mb-4 text-gray-300">Get health tips and updates in your inbox. No spam, only care.</p>
          {subscribed ? (
            <div className="bg-green-500 text-white p-3 rounded mb-4">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="p-3 rounded-l bg-white text-black w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <button 
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 rounded-r text-black font-bold transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Opening Hours</h4>
            <p className="text-gray-300">Mon-Fri: 8:00 AM - 8:00 PM</p>
            <p className="text-gray-300">Sat-Sun: 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm text-gray-300 py-4 border-t border-gray-700 bg-[#0a121f]">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} HealthSync. All rights reserved. | 
            <a href="#" className="hover:text-yellow-400 ml-2 transition-colors">Privacy Policy</a> | 
            <a href="#" className="hover:text-yellow-400 ml-2 transition-colors">Terms of Service</a> | 
            <a href="#" className="hover:text-yellow-400 ml-2 transition-colors">Sitemap</a>
          </p>
          <p className="mt-2 text-xs">
            The content on this website is for informational purposes only and should not be considered medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;