import React from 'react'
import FindDoc from '../components/cards/FindDoc'
import Services from '../components/cards/Services'
import ReviewList from '../components/cards/ReviewList'
import ContactHero from '../components/cards/ContactHero'
import Contact from '../components/cards/Contact'
import SubscribeButton from '../components/cards/SubscribeButton'

const ContactUs = () => {
  return (
     <div className="flex flex-col gap-[3rem]">
             {/* <ContactHero/> */}
            <div className='flex flex-col gap-[3rem] py-7  px-[7rem] items-center'>
                  <Contact/>
            </div>
        </div>
  )
}

export default ContactUs