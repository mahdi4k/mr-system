"use client"


import React, { useEffect, useState } from 'react';
import classes from "./pieces.module.css";
import { Badge, Card, Drawer, Flex, Group, Text } from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useGetCpusQuery } from "@/_redux/services/cpuApi";
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { addselectedCpu } from '@/_redux/features/cpu';
import { RootState } from '@/_redux/store';
import { ObjectIsEmpty } from '@/_utils/utils';

const Cpu = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [loadingSession, setLoadingSession] = useState(false)
    const session = useSession()
    const { isSuccess, data = [], error } = useGetCpusQuery(undefined, { skip: !loadingSession })
    const dispatch = useDispatch()
    const currentCpu = useSelector((state: RootState) => state.cpu.selectedCpu)

    console.log("🚀 ~ file: Cpu.tsx:23 ~ Cpu ~ currentCpu:", currentCpu)

    useEffect(() => {
        setLoadingSession(!!session.data)
    }, [session.data])

    const selectedCpu = (id: number) => {
        const cpu = data.find(el => el.id === id)
        if (cpu)
            dispatch(addselectedCpu(cpu))
        close()
    }

    return (
        <>
            <div onClick={open} className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentCpu) ? (
                    <Flex align={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fz={"8rem"} fw={"bold"}>CPU</Text>
                        <Image className={classes.piecesImg} width={60} height={60} src={'/svg/cpu.svg'} alt={'cpu'} />
                    </Flex>
                ) : (
                    <Card className={cardClasses.hoverCard}
                        style={{ padding: '0 45px' }} radius="md" withBorder>
                        <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                            {currentCpu.image && <Image alt={currentCpu.name} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentCpu.image}`} />}
                        </Card.Section>
                        <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                            <Badge color="pink" variant="light">
                                {currentCpu.manufacturer}
                            </Badge>
                            <Text fz={"sm"} mt={'md'}>{currentCpu.name}</Text>
                        </Flex>
                    </Card>
                )}
            </div>
            <Drawer position={"bottom"} opened={opened} onClose={close} title="انتخاب cpu">
                <Group>
                    {
                        data.map(el => (
                            <Card onClick={() => selectedCpu(el.id)} key={el.id} className={cardClasses.hoverCard}
                                style={{ padding: '0 45px' }} radius="md" withBorder>
                                <Card.Section style={{ textAlign: 'center' }} mt={'md'}>

                                    {el.image && <Image alt={el.name} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${el.image}`} />}

                                </Card.Section>

                                <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                                    <Badge color="pink" variant="light">
                                        {el.manufacturer}
                                    </Badge>
                                    <Text fz={"sm"} mt={'md'}>{el.name}</Text>
                                </Flex>
                            </Card>
                        ))
                    }
                </Group>
            </Drawer>
        </>

    );
};

export default Cpu;

