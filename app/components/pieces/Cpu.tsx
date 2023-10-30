"use client"


import React from 'react';
import classes from "./pieces.module.css";
import {  Flex, Text} from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";

const Cpu = () => {

    return (

        <div className={`${classes.pieces} ${cardClasses.cardMain}`}>
            <Flex align={'center'} direction={'column'}>
                <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                <Text fz={"8rem"} fw={"bold"}>CPU</Text>
                <Image className={classes.piecesImg} width={60} height={60} src={'/svg/cpu.svg'} alt={'cpu'} />
            </Flex>
        </div>
    );
};

export default Cpu;

