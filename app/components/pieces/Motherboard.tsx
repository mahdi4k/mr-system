"use client"

import React from 'react';
import classes from './pieces.module.css'
import {Flex, Text} from "@mantine/core";
import Image from "next/image";
import cardClasses from '../cardService/cardService.module.css'

const Motherboard = () => {
    return (
        <div className={`${classes.pieces} ${cardClasses.cardMain}`}>
            <Flex align={'center'} justify={'center'} direction={'column'}>
                <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                <Text fz={"4rem"} fw={"bold"}>motherboard</Text>
                <Image className={classes.piecesImg} width={60} height={60} src={'/svg/motherboard.svg'} alt={'motherboard'} />
            </Flex>

        </div>
    );
};

export default Motherboard;
