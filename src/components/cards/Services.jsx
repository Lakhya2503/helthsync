import React, { useState } from 'react';
import TritmentsCardList from './TritmentsCardList';
import Dental_tritment from '../../assets/doctor_images/index';
import Cardiology from '../../assets/doctor_images/index';
import Dermatology from '../../assets/doctor_images/index';
import Gynecology from '../../assets/doctor_images/index';
import Neurology from '../../assets/doctor_images/index';
import Orthopedics from '../../assets/doctor_images/index';
import Pediatrics from '../../assets/doctor_images/index';



const Services = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const servicesData = [
    {
      title: "General Dentistry",
      image:Dental_tritment.Dental_tritment, 
      description: "Comprehensive oral care including exams, cleanings, and basic treatments.",
      icon: "🦷",
      category: "dental",
      color: "bg-blue-100",
      borderColor: "border-blue-300",
      textColor: "text-blue-600"
    },
    {
      title: "Cardiology",
        image:Dental_tritment.Cardiology, 
      description: "Specialized heart care with advanced diagnostic and treatment options.",
      icon: "❤️",
      category: "cardio",
      color: "bg-red-100",
      borderColor: "border-red-300",
      textColor: "text-red-600"
    },
    {
      title: "Neurology",
        image:Dental_tritment.Neurology, 
      description: "Expert care for nervous system disorders and brain conditions.",
      icon: "🧠",
      category: "neuro",
      color: "bg-purple-100",
      borderColor: "border-purple-300",
      textColor: "text-purple-600"
    },
    {
      title: "Pediatrics",
        image:Dental_tritment.Pediatrics, 
      description: "Gentle, specialized care for our youngest patients.",
      icon: "👶",
      category: "children",
      color: "bg-yellow-100",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-600"
    },
    {
      title: "Orthopedics",
        image:Dental_tritment.Orthopedics, 
      description: "Treatment for musculoskeletal issues and injuries.",
      icon: "🦴",
      category: "bone",
      color: "bg-green-100",
      borderColor: "border-green-300",
      textColor: "text-green-600"
    },
    {
      title: "Dermatology",
      image:Dental_tritment.Dermatology, 
      description: "Skin care solutions for all ages and conditions.",
      icon: "🧴",
      category: "skin",
      color: "bg-pink-100",
      borderColor: "border-pink-300",
      textColor: "text-pink-600"
    },
     {
      title: "Ophthalmology",
      image: Dental_tritment.Ophthalmology,
      description: "Advanced eye care, diagnostics, and surgical treatments.",
      icon: "👁️",
      category: "eye",
      color: "bg-indigo-100",
      borderColor: "border-indigo-300",
      textColor: "text-indigo-600"
    },
    {
      title: "Endocrinology",
      image: Dental_tritment.Endocrinology,
      description: "Specialized hormone and metabolism care.",
      icon: "🧪",
      category: "hormones",
      color: "bg-teal-100",
      borderColor: "border-teal-300",
      textColor: "text-teal-600"
    },
    {
      title: "Gastroenterology",
      image: Dental_tritment.Gastroenterology,
      description: "Digestive system diagnostics and treatment.",
      icon: "🍽️",
      category: "digestive",
      color: "bg-orange-100",
      borderColor: "border-orange-300",
      textColor: "text-orange-600"
    },
    {
      title: "Pulmonology",
      image: Dental_tritment.Pulmonology,
      description: "Expert care for respiratory disorders and lung conditions.",
      icon: "🌬️",
      category: "lungs",
      color: "bg-gray-100",
      borderColor: "border-gray-300",
      textColor: "text-gray-600"
    },
    {
      title: "Rheumatology",
      image: Dental_tritment.Rheumatology,
      description: "Care for arthritis and autoimmune diseases.",
      icon: "💪",
      category: "joints",
      color: "bg-cyan-100",
      borderColor: "border-cyan-300",
      textColor: "text-cyan-600"
    },
    {
      title: "Psychiatry",
      image: Dental_tritment.Psychiatry,
      description: "Mental health support, therapy, and medication management.",
      icon: "🧘",
      category: "mental-health",
      color: "bg-lime-100",
      borderColor: "border-lime-300",
      textColor: "text-lime-600"
    },
    {
      title: "Urology",
      image: Dental_tritment.Urology,
      description: "Care for urinary tract and male reproductive health.",
      icon: "💧",
      category: "urinary",
      color: "bg-brown-100",
      borderColor: "border-brown-300",
      textColor: "text-brown-600"
    },
    {
      title: "Oncology",
      image: Dental_tritment.Oncology,
      description: "Cancer diagnosis, treatment, and support.",
      icon: "🎗️",
      category: "cancer",
      color: "bg-black-100",
      borderColor: "border-black-300",
      textColor: "text-black-600"
    },
    {
      title: "Plastic Surgery",
      image: Dental_tritment.PlasticSurgery,
      description: "Cosmetic and reconstructive surgical care.",
      icon: "🩹",
      category: "cosmetic",
      color: "bg-rose-100",
      borderColor: "border-rose-300",
      textColor: "text-rose-600"
    }

  ];

  const tabConfig = {
    all: { color: "bg-gray-100", text: "text-gray-800" },
    dental: { color: "bg-blue-100", text: "text-blue-800" },
    cardio: { color: "bg-red-100", text: "text-red-800" },
    neuro: { color: "bg-purple-100", text: "text-purple-800" },
    children: { color: "bg-yellow-100", text: "text-yellow-800" },
    bone: { color: "bg-green-100", text: "text-green-800" },
    skin: { color: "bg-pink-100", text: "text-pink-800" }
  };


  const filteredServices = activeTab === 'all' 
    ? servicesData 
    : servicesData.filter(service => service.category === activeTab);

  return (
    <div className="h-fit flex flex-col items-center py-16 px-4 sm:px-8 w-full gap-12 bg-gradient-to-b from-[#f0f9f9] to-white">
      <div className="flex flex-col items-center w-full gap-5 max-w-4xl text-center">
        <h3 className='text-4xl text-[#007E85] font-bold'>Our Comprehensive Services</h3>
        <p className='text-lg text-gray-600 w-full md:w-3/4'>
          We offer a wide range of specialized medical services to meet all your healthcare needs. 
          Our expert teams provide personalized care using the latest technologies and treatments.
        </p>
        
        {/* Service Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {Object.entries(tabConfig).map(([tab, {color, text}]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full capitalize transition-all duration-300 ${
                activeTab === tab
                  ? `${color} ${text} font-semibold shadow-md transform scale-105`
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? 'All Services' : tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Service Cards */}
      <div className="w-full max-w-9xl">
        <TritmentsCardList services={filteredServices} activeCategory={activeTab}  />
      </div>
      
      {/* CTA Section */}
      <div className="flex flex-col items-center gap-4 mt-8 text-center">
        <h4 className="text-2xl text-[#007E85] font-semibold">Can't find what you're looking for?</h4>
        <p className="text-gray-600 max-w-2xl">
          Our team is ready to help with any specialized needs. Contact us to discuss personalized treatment options.
        </p>
        <button className="mt-4 px-8 py-3 bg-gradient-to-r from-[#007E85] to-[#00A0A8] text-white rounded-full font-medium hover:from-[#005f63] hover:to-[#007E85] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
          Contact Our Specialists
        </button>
      </div>
    </div>
  );
};

export default Services;