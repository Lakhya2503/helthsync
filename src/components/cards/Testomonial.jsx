import React, { useState, useEffect } from 'react';
import TestimonialsCard from './TestomonialsCard';

const Testimonial = () => {
  return (
    <div className="h-fit flex flex-col items-center mt-20 w-full gap-12 py-12 bg-gray-50">
      <div className="flex flex-col items-center w-full gap-6">
        <h3 className='text-4xl font-bold text-[#007E85]'>Testimonials</h3>
        <p className='text-center w-[50%] text-gray-600 leading-relaxed'>
          Hear what our valued clients have to say about their experiences. 
          We take pride in delivering exceptional service and care to everyone who walks through our doors.
        </p>
      </div>
      <TestimonialsCard/>
    </div>
  )
}

export default Testimonial;