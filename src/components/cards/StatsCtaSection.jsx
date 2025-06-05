import React, { useState, useEffect } from 'react';
import Surgen from '../../assets/doctor_images/index';
import Button from '../Button';

const StatsCtaSection = () => {
  const [counters, setCounters] = useState({
    satisfaction: 0,
    patients: 0,
    recovered: 0,
    growth: 0
  });

  // Animation for counting up the stats
  useEffect(() => {
    const duration = 2000; // animation duration in ms
    const steps = 100; // number of steps
    const increment = {
      satisfaction: 99 / steps,
      patients: 15 / steps,
      recovered: 12 / steps,
      growth: 240 / steps
    };

    let current = {
      satisfaction: 0,
      patients: 0,
      recovered: 0,
      growth: 0
    };

    const interval = setInterval(() => {
      current = {
        satisfaction: Math.min(current.satisfaction + increment.satisfaction, 99),
        patients: Math.min(current.patients + increment.patients, 15),
        recovered: Math.min(current.recovered + increment.recovered, 12),
        growth: Math.min(current.growth + increment.growth, 240)
      };

      setCounters({
        satisfaction: Math.round(current.satisfaction),
        patients: Math.round(current.patients),
        recovered: Math.round(current.recovered),
        growth: Math.round(current.growth)
      });

      if (
        current.satisfaction >= 99 &&
        current.patients >= 15 &&
        current.recovered >= 12 &&
        current.growth >= 240
      ) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  // Hover effect for buttons
  const [hoverStates, setHoverStates] = useState({
    getStarted: false,
    talkToSale: false
  });

  return (
    <div className="h-fit flex flex-col items-center mt-20 gap-20 py-12 px-8 bg-gradient-to-b from-white to-[#f0f9f9]">
      <div className="text-center">
        <h3 className='text-4xl text-[#007E85] font-bold mb-4'>Our results in numbers</h3>
        <p className='text-lg text-gray-600 max-w-2xl'>
          We're proud of the impact we've made in healthcare. Here's what we've achieved together.
        </p>
      </div>

      <ul className="flex flex-wrap justify-center items-center w-full gap-12 max-w-6xl">
        {[
          { value: counters.satisfaction, suffix: '%', label: 'Customer Satisfaction', icon: '😊' },
          { value: counters.patients, suffix: 'k', label: 'Online Patients', icon: '👨‍⚕️' },
          { value: counters.recovered, suffix: 'k', label: 'Patients Recovered', icon: '💪' },
          { value: counters.growth, suffix: '%', label: 'Company Growth', icon: '📈' }
        ].map((stat, index) => (
          <li 
            key={index} 
            className="flex items-center flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-64"
          >
            <div className="text-5xl mb-2">{stat.icon}</div>
            <h4 className='text-5xl text-[#007E85] font-bold'>
              {stat.value}<span className='opacity-50'>{stat.suffix}</span>
            </h4>
            <h3 className='text-xl text-center mt-3 text-gray-700'>{stat.label}</h3>
          </li>
        ))}
      </ul>

      <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-12 max-w-6xl">
        <div className="w-full lg:w-[45%] flex flex-col gap-7">
          <h3 className='text-[#007E85] text-4xl font-bold leading-tight'>
            You have Lots of reasons to Choose us
          </h3>
          <p className='text-lg text-gray-600'>
            Our commitment to excellence in healthcare has transformed lives across the globe. 
            With cutting-edge technology and compassionate care, we're setting new standards 
            in patient outcomes and satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 mt-3">
            <Button 
              className={`py-4 px-8 rounded-full border-2 font-medium transition-all duration-300 ${
                hoverStates.getStarted 
                  ? 'border-[#007E85] text-white bg-[#007E85]' 
                  : 'border-gray-300 text-[#007E85] bg-white'
              }`}
              onMouseEnter={() => setHoverStates({...hoverStates, getStarted: true})}
              onMouseLeave={() => setHoverStates({...hoverStates, getStarted: false})}
            >
              Get Started
            </Button>
            <Button 
              className={`py-4 px-8 rounded-full border-2 font-medium transition-all duration-300 ${
                hoverStates.talkToSale 
                  ? 'border-[#005f63] text-white bg-[#005f63]' 
                  : 'border-gray-300 text-[#007E85] bg-white'
              }`}
              onMouseEnter={() => setHoverStates({...hoverStates, talkToSale: true})}
              onMouseLeave={() => setHoverStates({...hoverStates, talkToSale: false})}
            >
              Talk to Sales
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-[50%] relative group">
          <img 
            src={Surgen.Surgen} 
            alt="Doctor consulting with patient" 
            className='object-cover w-full h-auto rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105' 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#007E85] opacity-20 rounded-2xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCtaSection;