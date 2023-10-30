import React from 'react'
import { HeroHeader } from './components/HeroHome/HeroHeader'
import CardService from './components/cardService/CardService'
import CpuGraphic from "./components/cpuGraphic/CpuGraphic";
import CpuMotherboard from "./components/cpuMotherboard/CpuMotherboard";

const page = () => {
  return (
    <div>

      <HeroHeader />
      <CpuGraphic/>
      <CpuMotherboard/>
      <CardService />
    </div>
  )
}

export default page
