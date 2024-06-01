"use client"

import { Container } from '@mantine/core'
import React, { FC } from 'react'
import { Graphic } from '@/_redux/services/graphicApi'
import { CPU } from '@/_redux/services/cpuApi'
import { POWER } from '@/_redux/services/powerApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import dynamic from 'next/dynamic'
import BreadCrumbKiwi from '@/_components/single/BreadCrumbKiwi'


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
      return (
        <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
          <BreadCrumbKiwi title={product.name} type='cpu' />
          <ComponentCPU product={product as CPU} />
        </Container>
      );
    case "motherboards":
      return (
        <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
          <BreadCrumbKiwi title={product.name} type='motherboard' />
          <ComponentMotherboard product={product as Motherboard} />
        </Container>
      );
    case "graphics":
      return (
        <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
          <BreadCrumbKiwi title={product.name} type='graphic' />
          <ComponentGraphicCard product={product as Graphic} />
        </Container>
      );
    case "powers":
      return (
        <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
          <BreadCrumbKiwi title={product.name} type='power' />
          <ComponentPower product={product as POWER} />
        </Container>
      );
    default:
      return <h1>No piece match</h1>
  }


}

export default ClientPage