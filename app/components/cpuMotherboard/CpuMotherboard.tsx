"use client"
import React from 'react';
import {Text, Title, TextInput, Button, Group, Flex, Container} from '@mantine/core';
import classes from '../../cssModules/PcSection.module.css';
import Image from 'next/image'
import {IconArrowsExchange} from "@tabler/icons-react";

const CpuMotherboard = () => {
    return (
        <Container my={'xl'} size="xl">
            <Flex className={classes.wrapper}>
                <Image width={500}
                       height={500} alt="graphic card vs cpu"
                       src={'/svg/cpu-motherboard.svg'} className={classes.image}/>
                <div className={classes.bodyRight}>
                    <Group mb={'md'} align={'center'}>
                        <Title fs={'italic'} className={classes.title}>CPU</Title>
                        <IconArrowsExchange/>
                        <Title fs={'italic'}>Motherboard</Title>
                    </Group>

                    <Text fz="md" c="dimmed">
                        در این قسمت میتوانید cpu مناسب برای مادربورد خود یا برعکس مادربورد مناسب cpu خود را انتخاب
                        کنید
                    </Text>
                    <div className={`${classes.controls} ${classes.flexStart}`}>
                        <Button className={classes.control}>انتخاب</Button>
                    </div>
                </div>

            </Flex>
        </Container>
    );
};

export default CpuMotherboard;
