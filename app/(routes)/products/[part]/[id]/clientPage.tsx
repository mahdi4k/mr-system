"use client"

import { Container, Grid } from '@mantine/core'
import React, { FC } from 'react'
import Image from 'next/image'
import { Graphic } from '@/_redux/services/graphicApi'
import { CPU } from '@/_redux/services/cpuApi'
import { POWER } from '@/_redux/services/powerApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import dynamic from 'next/dynamic'


type productType = {
  product: Graphic | CPU | POWER | Motherboard
  type: 'graphics' | 'powers' | 'motherboards' | 'cpus'
}


const ComponentCPU = dynamic(() => import('@/_components/single/CpuSingle'), { ssr: false })
const ComponentMotherboard = dynamic(() => import('@/_components/single/MotherboardSingle'), { ssr: false })
const ComponentGraphicCard = dynamic(() => import('@/_components/single/GraphicCardSingle'), { ssr: false })
const ComponentPower = dynamic(() => import('@/_components/single/PowerSingle'), { ssr: false })


const ClientPage: FC<productType> = ({ product, type }) => {

  switch (type) {
    case "cpus":
      return <ComponentCPU product={product as CPU} />;
    case "motherboards":
      return <ComponentMotherboard product={product as Motherboard} />;
    case "graphics":
      return <ComponentGraphicCard product={product as Graphic} />;
    case "powers":
      return <ComponentPower product={product as POWER} />;
    default:
      return <h1>No piece match</h1>
  }


}

export default ClientPage