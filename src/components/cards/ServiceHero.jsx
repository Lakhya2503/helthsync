import React from 'react'
import Hospital_Image from '../../assets/doctor_images/index'
import Button from '../Button'
import Input from '../Input'
import Appointments from './Appointments'

const ServiceHero = () => {
  return (
    <div className='relative'>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div 
        className="relative bg-cover bg-center flex items-center justify-around h-fit py-20 w-full min-h-[80vh]" 
        style={{ backgroundImage: `url(${Hospital_Image.Hospital_Image})` }}
      >
        <div className="z-10 w-[25vw] leading-7 flex flex-col gap-7">
          <h2 className='text-5xl font-bold text-white drop-shadow-lg'>
            Meet the <span className="text-[#007E85]">Best</span> Hospital
          </h2>
          <p className='w-[75%] text-white text-lg font-medium drop-shadow-md'>
            We know how large objects will act, but things on a small scale.
          </p>
          <div className="flex gap-5 mt-4">
            <Button 
              className={`font-bold hover:bg-[#007E85] hover:border-[#007E85] bg-transparent text-lg border-2 border-white text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105`}
            > 
              Get Quote Now
            </Button>
            <Button 
              className={`font-bold bg-[#007E85] hover:bg-[#00676d] text-lg border-2 border-[#007E85] text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105`}
            > 
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="z-10 w-fit bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          <Appointments/>
        </div>
      </div>
    </div>
  )
}

export default ServiceHero