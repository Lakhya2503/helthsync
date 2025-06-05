import React, { useState, useEffect } from 'react';
import Feed_1 from '../../assets/doctor_images/index';
import Feed_2 from '../../assets/doctor_images/index';
import Feed_3 from '../../assets/doctor_images/index';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimonialsCard = () => {
  const testimonials = [
    {
      name: "Anita Mehra",
      position: "HR Manager",
      company: "HCL Technologies",
      service: "Results & Satisfaction",
      feedImage: Feed_1.Feed_1,
      message: "From the moment I walked in, I felt welcomed and cared for. The doctors explained everything clearly, and the staff went above and beyond to make me comfortable."
    },
    {
      name: "Rajiv Sharma",
      position: "Software Engineer",
      company: "Infosys",
      service: "Professionalism & Expertise",
      feedImage: Feed_3.Feed_3,
      message: "I received exceptional treatment for my back pain. The physiotherapist was knowledgeable, patient, and truly listened to my concerns. The results were noticeable after just a few sessions."
    },
    {
      name: "Fatima Qureshi",
      position: "Marketing Executive",
      company: "TCS",
      service: "Trust & Care",
      feedImage: Feed_2.Feed_2,
      message: "I've never had such a smooth and reassuring experience with dental care. The clinic is clean, modern, and the results exceeded my expectations. Highly recommended!"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Desktop View - Grid */}
      <div className="hidden md:grid grid-cols-3 gap-8 px-4">
        {testimonials.map((feedback, index) => (
          <div 
            key={feedback.name}  
            className={`w-full h-[420px] bg-white items-start px-8 py-6 gap-6 flex flex-col rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${index === currentIndex ? 'border-2 border-[#007E85]' : 'border border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={feedback.feedImage} 
                  alt={feedback.name} 
                  className='object-cover rounded-full bg-sky-100 h-20 w-20'
                />
                <FaQuoteLeft className="absolute -top-2 -left-2 text-[#007E85] bg-white p-1 rounded-full" />
              </div>
              <div>
                <h3 className='text-xl font-semibold text-[#007E85]'>{feedback.name}</h3>
                <p className='text-sm text-gray-500'>{feedback.company} - {feedback.position}</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4">
              <h4 className='text-xl font-medium text-gray-800'>"{feedback.service}"</h4>
              <p className='text-gray-600 leading-relaxed'>{feedback.message}</p>
            </div>
            <div className="mt-auto w-full flex justify-center">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full ${idx === index ? 'bg-[#007E85]' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - Carousel */}
      <div className="md:hidden w-full overflow-hidden relative">
        <div 
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((feedback, index) => (
            <div 
              key={feedback.name}  
              className="w-full flex-shrink-0 px-6 py-4"
            >
              <div className="w-full h-[420px] bg-white items-start px-6 py-6 gap-6 flex flex-col rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={feedback.feedImage} 
                      alt={feedback.name} 
                      className='object-cover rounded-full bg-sky-100 h-16 w-16'
                    />
                    <FaQuoteLeft className="absolute -top-1 -left-1 text-[#007E85] bg-white p-1 rounded-full text-xs" />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-[#007E85]'>{feedback.name}</h3>
                    <p className='text-xs text-gray-500'>{feedback.company} - {feedback.position}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3">
                  <h4 className='text-lg font-medium text-gray-800'>"{feedback.service}"</h4>
                  <p className='text-gray-600 text-sm leading-relaxed'>{feedback.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-[#007E85]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-[#007E85] hover:bg-[#007E85] hover:text-white"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-[#007E85] hover:bg-[#007E85] hover:text-white"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TestimonialsCard;