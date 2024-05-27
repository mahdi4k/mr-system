"use client"
import React from 'react';
import { Text, Title, TextInput, Button, Group, Flex, Container } from '@mantine/core';
import classes from '@/_cssModules/PcSection.module.css';
import Image from 'next/image'
import { IconArrowsExchange } from "@tabler/icons-react";
import Link from "next/link";

const GraphicPower = () => {
    return (
        <Container my={'xl'} size="lg">
            <Flex className={`${classes.wrapper} ${classes.flexColumn}`}>

                <div className={classes.bodyLeft}>
                    <Group mb={'md'} align={'center'}>
                        <Title fs={'italic'} className={classes.title}>کارت گرافیک</Title>
                        <IconArrowsExchange />
                        <Title className={classes.title} fs={'italic'}>پاور</Title>
                    </Group>

                    <Text fz="md" c="dimmed">
                        در این قسمت میتوانید پاور مناسب برای گرافیک خود را انتخاب
                        کنید
                    </Text>
                    <div className={`${classes.controls} ${classes.flexEnd}`}>
                        <Link href={'/pieces/graphic/power'}>
                            <Button px={'xl'} variant="gradient"
                                gradient={{ from: ' rgb(14,163,93)', to: ' rgb(12,119,115)', deg: 90 }}
                            >انتخاب</Button>
                        </Link>
                    </div>
                </div>
                <Link className={classes.image} href={'/pieces/graphic/power'}>

                    <Image fill alt="graphic card vs cpu"
                        src={'/svg/graphic-power.svg'}  />
                </Link>

            </Flex>
        </Container>
    );
};

export default GraphicPower;
