"use client"


import React, { useEffect, useState } from 'react';
import classes from "./pieces.module.css";
import { Badge, Card, Drawer, Flex, Group, Text } from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";
import { useDisclosure } from "@mantine/hooks";
import { CPU, useGetCpusQuery } from "@/_redux/services/cpuApi";
import { useDispatch, useSelector } from 'react-redux';
import { addselectedCpu, relatedMotherboardList } from '@/_redux/features/cpu';
import { RootState } from '@/_redux/store';
import { ObjectIsEmpty } from '@/_utils/utils';
import { IconX } from '@tabler/icons-react';

const Cpu = () => {
    const [opened, { open, close }] = useDisclosure(false);
    // const { isSuccess, data = [], error } = useGetCpusQuery(undefined, { skip: !loadingSession })
    const [cpuSelected, setSelectedCpu] = useState<CPU[]>()
    const dispatch = useDispatch()


    const cpuListFromSelectedMotherboard = useSelector((state: RootState) => state.motherboard.relatedCpu);
    const { isSuccess, data = [], error, } = useGetCpusQuery();
    const currentCpu = useSelector((state: RootState) => state.cpu.selectedCpu);

    const selectedCpu = (id: number) => {
        const cpu = data.find(el => el.id === id)
        if (cpu) {
            dispatch(addselectedCpu(cpu))
            relatedMotherboard(cpu)
        }
        close()
    }

    const relatedMotherboard = (cpu: CPU) => {
        dispatch(relatedMotherboardList(cpu.motherboards))
    }

    const removeSelected = () => {
        dispatch(addselectedCpu({}))
        dispatch(relatedMotherboardList([]))
    }
    useEffect(() => {
        setSelectedCpu(cpuListFromSelectedMotherboard.length ? cpuListFromSelectedMotherboard : data);
    }, [cpuListFromSelectedMotherboard, isSuccess])


    return (
        <>
            <div className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentCpu) ? (
                    <Flex onClick={open} align={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fz={"8rem"} fw={"bold"}>CPU</Text>
                        <Image className={classes.piecesImg} width={60} height={60} src={'/svg/cpu.svg'} alt={'cpu'} />
                    </Flex>
                ) : (
                    <Card style={{ padding: '0 45px' }} radius="md" withBorder>
                        <IconX onClick={removeSelected} size={18} style={{ position: 'absolute', right: '4px', top: '3px' }} />
                        <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                            {currentCpu.image && <Image alt={currentCpu.name ? currentCpu.name : ''} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentCpu.image}`} />}
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
                        cpuSelected?.map(el => (
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

