"use client"
import React from 'react';
import {Text, Title, TextInput, Button, Group, Flex, Container} from '@mantine/core';
import classes from '@/_cssModules/PcSection.module.css';
import Image from 'next/image'
import {IconArrowsExchange} from "@tabler/icons-react";
import Link from "next/link";

const CpuMotherboard = () => {
    return (
        <Container my={'xl'} size="xl">
            <Flex className={`${classes.wrapper} ${classes.flexColumn}`}>
                
                <div className={classes.bodyLeft}>
                    <Group mb={'md'} align={'center'}>
                        <Title fs={'italic'} className={classes.title}>CPU</Title>
                        <IconArrowsExchange/>
                        <Title className={classes.title} fs={'italic'}>Motherboard</Title>
                    </Group>

                    <Text fz="md" c="dimmed">
                        در این قسمت میتوانید cpu مناسب برای مادربورد خود یا برعکس مادربورد مناسب cpu خود را انتخاب
                        کنید
                    </Text>
                    <div className={`${classes.controls} ${classes.flexEnd}`}>
                        <Link href={'/pieces/motherboard/cpu'}>
                            <Button px={'xl'} variant="gradient"
                                    gradient={{from: ' rgb(14,163,93)', to: ' rgb(12,119,115)', deg: 90}}
                                    >انتخاب</Button>
                        </Link>
                    </div>
                </div>
                <Image width={500}
                       height={500} alt="graphic card vs cpu"
                       src={'/svg/cpu-motherboard.svg'} className={classes.image}/>

            </Flex>
        </Container>
    );
};

export default CpuMotherboard;
