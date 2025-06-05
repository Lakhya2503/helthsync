import React from 'react'
import Hospital_Image from '../../assets/doctor_images/index'
import Button from '../Button'
import Input from '../Input'

const ContactHero = () => {
  return (
        <div className=" bg-cover bg-center flex items-center justify-around h-[85vh] py-15 w-full" style={{ backgroundImage: `url(${Hospital_Image.Hospital_Image})` }}>
        </div>
  )
}

export default ContactHero  
