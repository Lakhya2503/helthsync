import React from 'react'
import ServiceHero from '../components/cards/ServiceHero'
import FindDoc from '../components/cards/FindDoc'
import Services from '../components/cards/Services'
import ReviewList from '../components/cards/ReviewList'
import SubscribeButton from '../components/cards/SubscribeButton'

const Service = () => {
  return (
    <div className="flex flex-col gap-[3rem] bg-gradient-to-b from-blue-50 to-white">
      <ServiceHero/>
      
      <div className='flex flex-col items-center gap-[3rem] py-12 px-[7rem]'>
        {/* Find Doctor Section */}
        <div className="w-full bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <FindDoc/>
        </div>
        
        {/* Services Section */}
        <div className="w-full">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Our Healthcare Services</h2>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            <Services/>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="w-full">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Patient Testimonials</h2>
          <div className="bg-blue-50 rounded-xl shadow-lg p-8 border border-blue-200">
            <ReviewList/>
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        {/* <div className="w-full bg-blue-700 rounded-xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Our Health Tips</h2>
          <p className="mb-6 text-blue-100">Subscribe to our newsletter for the latest health news and advice</p>
          <div className="flex justify-center">
            <SubscribeButton className="bg-white text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-full font-semibold shadow-md"/>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Service