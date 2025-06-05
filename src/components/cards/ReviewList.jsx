import React from 'react'
import ReviewCard from './ReviewCard'
import Doctor_1 from '../../assets/doctor_images/index'

const ReviewList = () => {
  const testimonials = [
    {
      image: Doctor_1.Doctor_2,
      rating: 5,
      message: "Exceptional care and attention. I felt truly heard.",
    },
    {
        image: "/images/customer2.jpg",
        rating: 4,
        message: "Professional staff and smooth experience. Highly recommend!",
        image: Doctor_1.Doctor_3,
    },
    {
        image: "/images/customer3.jpg",
        rating: 5,
        message: "Absolutely wonderful service from start to finish!",
        image: Doctor_1.Doctor_4,
    },
  ];

  return (
    <div className="h-fit flex flex-col items-center mt-13 w-full gap-12">
      <div className="flex flex-col items-center w-full gap-3">
        <h3 className="text-3xl text-[#007E85]">Testimonials</h3>
        <p className="text-center w-[50%] text-gray-600">
          Hear what our happy clients have to say about their experience with us.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {testimonials.map((testimonial, index) => (
          <ReviewCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
