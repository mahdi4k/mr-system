import React from 'react'
import { HeroHeader } from '@/_components/HeroHome/HeroHeader'
import CardService from '@/_components/cardService/CardService'
import CpuGraphic from "@/_components/cpuGraphic/CpuGraphic"
import CpuMotherboard from "@/_components/cpuMotherboard/CpuMotherboard"

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
