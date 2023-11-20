import React, {FC} from 'react';
import dynamic from "next/dynamic";

const ComponentCPU = dynamic(() => import('../../_components/pieces/Cpu'), {ssr: false}) as FC
const ComponentMotherboard = dynamic(() => import('../../_components/pieces/Motherboard'), {ssr: false}) as FC
const ComponentGraphicCard = dynamic(() => import('../../_components/pieces/GraphicCard'), {ssr: false}) as FC

type Iprop =  'motherboard'| 'cpu' | 'graphic'
const UsePiecePc  = (props : Iprop) => {
    switch (props) {
        case "cpu":
            return <ComponentCPU/>;
        case "motherboard":
            return <ComponentMotherboard/>;
        case "graphic":
            return <ComponentGraphicCard/>;
        default:
            return <h1>No piece match</h1>
    }

};

export default UsePiecePc;
