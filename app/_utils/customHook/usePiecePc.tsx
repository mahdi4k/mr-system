import React, {FC, useState} from 'react';
import dynamic from "next/dynamic";
import { CPU } from '@/_redux/services/cpuApi';
import { IcpuProps } from '../../_components/pieces/Cpu';
import { ImotherboardProps } from '../../_components/pieces/Motherboard';
import { Motherboard } from '@/_redux/services/motherboardApi';
import { Graphic } from '@/_redux/services/graphicApi';
import { IgraphicProps } from '../../_components/pieces/GraphicCard';

 
type Iprop =  'motherboard'| 'cpu' | 'graphic'

const ComponentCPU = dynamic(() => import('../../_components/pieces/Cpu'), {ssr: false}) as FC<IcpuProps>
const ComponentMotherboard = dynamic(() => import('../../_components/pieces/Motherboard'), {ssr: false}) as FC<ImotherboardProps>
const ComponentGraphicCard = dynamic(() => import('../../_components/pieces/GraphicCard'), {ssr: false}) as FC<IgraphicProps>

const UsePiecePc  = (props : Iprop) => {

    const [activeCpu,setActiveCpu] = useState<Partial<CPU> | undefined>()
    const [activeMotherboard,setActiveMotherboard] = useState<Partial<Motherboard> | undefined>()
    const [activeGraphic,setActiveGraphic] = useState<Partial<Graphic> | undefined>()
    switch (props) {
        case "cpu":
            return <ComponentCPU setActiveCpu={setActiveCpu} activeCpu={activeCpu}  />;
        case "motherboard":
            return <ComponentMotherboard setActiveMotherboard={setActiveMotherboard} activeMotherboard={activeMotherboard} />;
        case "graphic":
            return <ComponentGraphicCard setActiveGraphic={setActiveGraphic} activeGraphic={activeGraphic} />;
        default:
            return <h1>No piece match</h1>
    }

};

export default UsePiecePc;
