import React, { FC, useState } from 'react';
import dynamic from "next/dynamic";


type Iprop = 'motherboard' | 'cpu' | 'graphic' | 'power' | 'ssd' | 'fan' | 'case' | 'ram'

const ComponentCPU = dynamic(() => import('@/_components/category/CpuCategory'), { ssr: false }) as FC
const ComponentMotherboard = dynamic(() => import('@/_components/category/MotherboardCategory'), { ssr: false }) as FC
const ComponentGraphicCard = dynamic(() => import('@/_components/category/GraphicCardCategory'), { ssr: false }) as FC
const ComponentPower = dynamic(() => import('@/_components/category/PowerCategory'), { ssr: false }) as FC
const ComponentSsd = dynamic(() => import('@/_components/category/SsdCategory'), { ssr: false }) as FC
const ComponentFan = dynamic(() => import('@/_components/category/FanCategory'), { ssr: false }) as FC
const ComponentCase = dynamic(() => import('@/_components/category/CaseCategory'), { ssr: false }) as FC
const ComponentRam = dynamic(() => import('@/_components/category/RamCategory'), { ssr: false }) as FC

const UseCategoryPage = (props: Iprop) => {

    switch (props) {
        case "cpu":
            return <ComponentCPU />;
        case "motherboard":
            return <ComponentMotherboard />;
        case "graphic":
            return <ComponentGraphicCard />;
        case "power":
            return <ComponentPower />;
        case "ssd":
            return <ComponentSsd />;
        case "fan":
            return <ComponentFan />;
        case "case":
            return <ComponentCase />;
        case "ram":
            return <ComponentRam />;
        default:
            return <h1>No piece match</h1>
    }

};

export default UseCategoryPage;
