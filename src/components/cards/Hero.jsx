import React from 'react';
import Doctor_1 from '../../assets/doctor_images/index'
import Doctor_2 from '../../assets/doctor_images/index'
import Doctor_3 from '../../assets/doctor_images/index'
import Doctor_4 from '../../assets/doctor_images/index'
import Doctor_5 from '../../assets/doctor_images/index'
import Doctor_6 from '../../assets/doctor_images/index'
import  Play_Svg  from '../../assets/svg';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const avatars = [
    Doctor_1.Doctor_1,
    Doctor_2.Doctor_2,
    Doctor_3.Doctor_3,
    Doctor_4.Doctor_4,
    Doctor_5.Doctor_5,
    Doctor_6.Doctor_6
  ];

  return (
    <div className="relative w-full my-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text content */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Providing Quality <span className="text-blue-600">HealthSync</span> for a{' '}
            <span className="text-green-600">Brighter</span> and{' '}
            <span className="text-green-600">Healthy</span> Future
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            At our hospital, we are dedicated to providing exceptional medical care to our patients 
            and their families. Our experienced team of medical professionals, cutting-edge technology, 
            and compassionate approach make us a leader in the healthcare industry.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
            <Button 
              onClick={() => navigate('/service')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book Appointments
            </Button>

            <div className="flex items-center gap-4 cursor-pointer group">
              <button className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                <img src={Play_Svg.Play_Svg} alt="Play" className="h-6 w-6 ml-1" />
              </button>
              <span className="text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                Watch Video
              </span>
            </div>
          </div>
        </div>

        {/* Doctor image with badges */}
        <div className="lg:w-1/2 relative">
          <div className="relative">
            <img 
              src={Doctor_5.Doctor_5} 
              alt="Doctor" 
              className="w-full max-w-lg h-auto rounded-3xl shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500"
            />
            
            {/* 24/7 Service Badge */}
            <div className="absolute top-8 right-0 md:right-8 bg-white px-6 py-3 rounded-xl shadow-lg border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-blue-800">24/7 Service</span>
              </div>
            </div>

            {/* Professionals Badge */}
            <div className="absolute bottom-8 left-0 md:left-8 bg-white px-6 py-4 rounded-xl shadow-lg border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-gray-600 mb-2">Our Professionals</span>
                <div className="flex -space-x-2">
                  {avatars.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Doctor ${index + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-600 text-white text-sm font-bold border-2 border-white">
                    30+
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;