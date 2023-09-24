import React from 'react'
import { Header } from './components/Header/Header'
import { HeroHeader } from './components/HeroHome/HeroHeader'
import CardService from './components/cardService/CardService'
import { Footer } from './components/Footer/Footer'

const page = () => {
  return (
    <div>
      <Header />
      <HeroHeader />
      <CardService />
      <Footer/>
    </div>
  )
}

export default page