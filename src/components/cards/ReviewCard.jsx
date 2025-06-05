import React from 'react'
import { FaStar, FaRegStar } from "react-icons/fa";

const ReviewCard = ({
  image, rating, message
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center space-y-4">
    <img
      src={image}
      alt="Customer"
      className="w-20 h-20 mx-auto rounded-full object-cover bg-sky-400"
    />
    <div className="flex justify-center space-x-1 text-yellow-400">
      {[...Array(5)].map((_, i) =>
        i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
      )}
    </div>
    <p className="text-gray-600 italic text-sm">"{message}"</p>
  </div>
  )
}

export default ReviewCard