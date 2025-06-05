import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaStar } from 'react-icons/fa';

const DocMemberCard = ({
  last_name,
  first_name,
  profile_image,
  email,
  // phone_number,
  specialty,
  id,
  description,
  rating = 4.7 // Default rating
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleAppointment = () => {
    navigate(`/appointment/doctorId/${id}`);
  };

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-amber-400 opacity-50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div 
      className="w-full h-full transition-all duration-300 ease-in-out hover:transform hover:scale-[1.02] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-full h-full bg-gradient-to-br from-white to-teal-50 p-6 flex flex-col gap-6 rounded-xl shadow-lg border border-teal-100 transition-all duration-300 ${
          isHovered ? 'ring-2 ring-teal-300 shadow-xl' : ''
        }`}
      >
        {/* Doctor Image with Hover Effect */}
        <div className="relative mx-auto">
          <div className="relative rounded-full overflow-hidden border-4 border-white shadow-lg w-48 h-48 group-hover:border-teal-200 transition-all duration-500">
            <div className="absolute inset-0 bg-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"></div>
            <img
              src={profile_image || 'https://via.placeholder.com/200'}
              alt={`Profile of Dr. ${first_name} ${last_name}`}
              className="w-full h-full object-cover transition-all duration-500 relative z-10"
              style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/200')}
            />
          </div>
          
          {isHovered && (
            <button 
              onClick={handleAppointment}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg z-10 flex items-center gap-2 animate-bounce"
            >
              <FaCalendarAlt />
              Book Now
            </button>
          )}
        </div>

        {/* Doctor Information */}
        <div className="flex flex-col items-center text-center gap-3">
          <h3 className="text-2xl font-bold text-teal-900 group-hover:text-teal-800 transition-colors">
            Dr. {first_name} {last_name}
          </h3>
          
          <div className="flex items-center gap-1">
            {renderStars()}
            <span className="text-sm text-amber-600 ml-1 font-medium">{rating}</span>
          </div>
          
          <h4 className="text-lg font-semibold text-amber-600 uppercase tracking-wider bg-amber-50 px-4 py-1 rounded-full">
            {specialty || 'General Practitioner'}
          </h4>
          
          <p className="text-gray-600 line-clamp-3 group-hover:text-gray-700 transition-colors">
            {description || 'Board-certified specialist with extensive experience in patient care.'}
          </p>
        </div>

        {/* Contact and Action Section */}
        <div className="mt-auto">
          <div className="flex flex-col gap-3 text-sm text-gray-600 mb-4">
            {/* <div className="flex items-center gap-3 p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-2 rounded-full">
                <FaPhone className="text-teal-600" />
              </div>
              <span className="font-medium">{phone_number || 'Phone: Not available'}</span>
            </div> */}
            
            <div className="flex items-center gap-3 p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-2 rounded-full">
                <FaEnvelope className="text-teal-600" />
              </div>
              <span className="font-medium truncate">{email}</span>
            </div>
          </div>

          <button
            onClick={handleAppointment}
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
          >
            <FaCalendarAlt />
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocMemberCard;