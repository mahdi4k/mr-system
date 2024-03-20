import React from 'react'
import { HeroHeader } from '@/_components/HeroHome/HeroHeader'
import CardService from '@/_components/cardService/CardService'
import CpuGraphic from "@/_components/cpuGraphic/CpuGraphic"
import CpuMotherboard from "@/_components/cpuMotherboard/CpuMotherboard"
import GraphicPower from './_components/graphicPower/GraphicPower'
import CardParts from './_components/cardParts/CardParts'
import ArticleSection from './_components/articleSection/ArticleSection'

const page = () => {
  return (
    <div>

      <HeroHeader />
      <CardParts />
      <CpuMotherboard />
      <CpuGraphic />
      <GraphicPower />
      {/* <CardService /> */}
      <ArticleSection />
    </div>
  )
}

export default page
