import React from 'react';
import doctor_images from '../../assets/doctor_images';

const TritmentsCardList = ({ services, activeCategory}) => {

services.map((item)=>{
  console.log(item.image);
})
  
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full h-fit gap-6 px-4 sm:px-6 lg:px-8 py-8">
      {services.map((service) => (
        <div 
          key={service.title}  
          className={`w-full h-[390px] ${service.color} border ${service.borderColor} px-5 py-6 gap-4 flex flex-col rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}
        >
          <div className="w-full h-40 rounded-xl overflow-hidden relative">
            <img 
              src={service.image} 
              alt={service.title} 
              className='w-full h-full object-cover rounded-xl transform group-hover:scale-110 transition duration-500'
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition duration-300"></div> */}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-3xl ${service.textColor}`}>{service.icon}</span>
            <h3 className={`text-2xl font-bold ${service.textColor}`}>{service.title}</h3>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed flex-grow">{service.description}</p>
          <div className="flex items-center group">
            <span className={`text-lg font-medium ${service.textColor} group-hover:underline`}>Learn More</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 ${service.textColor}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      ))}       
    </div>
  );
}

export default TritmentsCardList;