import React from 'react'
import Hero from '../components/cards/Hero'
import StatsCtaSection from '../components/cards/StatsCtaSection'
import Services from '../components/cards/Services'
import TeamMembers from '../components/cards/TeamMembers'
import Testomonial from '../components/cards/Testomonial'
import FindDoc from '../components/cards/FindDoc'
import SubscribeButton from '../components/cards/SubscribeButton'

const Landing = () => {
  return (
    <div className='py-7 flex flex-col gap-[3rem] items-center px-[5rem]' >
        <Hero/>
        <FindDoc/>
        <StatsCtaSection/>
        <Services/>
        <TeamMembers/>
        <Testomonial/>
    </div>
  )
}

export default Landing