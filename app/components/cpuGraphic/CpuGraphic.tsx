"use client"
import React from 'react';
import {Text, Title, TextInput, Button, Group, Flex, Container} from '@mantine/core';
import classes from '../../cssModules/PcSection.module.css';
import Image from 'next/image'
import {IconArrowsExchange} from "@tabler/icons-react";

const CpuGraphic = () => {
    return (
        <Container my={'xl'} size="xl">
            <Flex className={classes.wrapper}>
                <div className={classes.bodyLeft}>
                    <Group mb={'md'} align={'center'}>
                        <Title fs={'italic'} className={classes.title}>CPU</Title>
                        <IconArrowsExchange/>
                        <Title fs={'italic'}>Graphic</Title>
                    </Group>

                    <Text fz="md" c="dimmed">
                        در این قسمت میتوانید cpu مناسب برای کارت گرافیک یا برعکس کارت گرافیک مناسب cpu خود را انتخاب
                        کنید
                    </Text>
                    <div className={classes.controls}>
                        <Button className={classes.control}>انتخاب</Button>
                    </div>
                </div>
                <Image width={500}
                       height={500} alt="graphic card vs cpu"
                       src={'/svg/cpu-graphic.svg'} className={classes.image}/>
            </Flex>
        </Container>
    );
};

export default CpuGraphic;
