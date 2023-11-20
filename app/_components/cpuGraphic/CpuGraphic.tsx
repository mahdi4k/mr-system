"use client"
import React from 'react';
import {Text, Title, TextInput, Button, Group, Flex, Container} from '@mantine/core';
import classes from '@/_cssModules/PcSection.module.css';
import Image from 'next/image'
import {IconArrowsExchange} from "@tabler/icons-react";
import Link from "next/link";

const CpuGraphic = () => {
    return (
        <Container my={'xl'} size="xl">
            <Flex className={classes.wrapper}>
                <div className={classes.bodyLeft}>
                    <Group mb={'md'} align={'center'}>
                        <Title fs={'italic'} className={classes.title}>CPU</Title>
                        <IconArrowsExchange/>
                        <Title className={classes.title} fs={'italic'}>Graphic</Title>
                    </Group>

                    <Text fz="md" c="dimmed">
                        در این قسمت میتوانید cpu مناسب برای کارت گرافیک یا برعکس کارت گرافیک مناسب cpu خود را انتخاب
                        کنید
                    </Text>
                    <div className={classes.controls}>
                        <Link href={'/'}>
                            <Button px={'xl'} variant="gradient"
                                    gradient={{from: 'indigo', to: 'cyan', deg: 90}}
                            >انتخاب</Button>
                        </Link>
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
