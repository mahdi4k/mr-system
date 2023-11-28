"use client"

import React, { useEffect, useState } from 'react';
import classes from './pieces.module.css'
import { Badge, Card, Drawer, Flex, Group, Text } from "@mantine/core";
import Image from "next/image";
import cardClasses from '../cardService/cardService.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/_redux/store';
import { useDisclosure } from '@mantine/hooks';
import { Motherboard, useGetMotherboardsQuery } from '@/_redux/services/motherboardApi';
import { addselectedMotherboard, relatedCpuList } from '@/_redux/features/motherboard';
import { ObjectIsEmpty } from '@/_utils/utils';
import { Motherboard as MotherboardType } from '@/_redux/services/motherboardApi';
import { IconX } from '@tabler/icons-react';

const Motherboard = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch()
    const [motherboardSelected, setSelectedMotherboard] = useState<MotherboardType[]>()


    const MotherboardListFromSelectedCpu = useSelector((state: RootState) => state.cpu.relatedMotherboards)
    const currentMotherboard = useSelector((state: RootState) => state.motherboard.selectedMotherboard)
    const { isSuccess, data = [], error } = useGetMotherboardsQuery()


    const selectedMotherboard = (id: number) => {
        const motherboard = data.find(el => el.id === id)
        if (motherboard) {
            dispatch(addselectedMotherboard(motherboard));
            relatedCpu(motherboard)
        }

        close()
    }

    const relatedCpu = (motherboard: Motherboard) => {
        dispatch(relatedCpuList(motherboard.cpus))
    }

    const removeSelected = () => {
        dispatch(addselectedMotherboard({}))
        dispatch(relatedCpuList([]))
    }
    useEffect(() => {

        setSelectedMotherboard(MotherboardListFromSelectedCpu.length ? MotherboardListFromSelectedCpu : data);
    }, [MotherboardListFromSelectedCpu, isSuccess])

    return (
        <>

            <div className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentMotherboard) ? (
                    <Flex onClick={open} align={'center'} justify={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fz={"4rem"} fw={"bold"}>motherboard</Text>
                        <Image className={classes.piecesImg} width={60} height={60} src={'/svg/motherboard.svg'} alt={'motherboard'} />
                    </Flex>
                ) : (
                    <Card style={{ padding: '0 45px' }} radius="md" withBorder>
                        <IconX onClick={removeSelected} size={18} style={{ position: 'absolute', right: '4px', top: '3px' }} />
                        <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                            {currentMotherboard.image && <Image alt={currentMotherboard.name ? currentMotherboard.name : ''} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentMotherboard.image}`} />}
                        </Card.Section>
                        <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                            <Badge color="pink" variant="light">
                                {currentMotherboard.brand}
                            </Badge>
                            <Text fz={"sm"} mt={'md'}>{currentMotherboard.name}</Text>
                        </Flex>
                    </Card>
                )}
            </div>
            <Drawer position={"bottom"} opened={opened} onClose={close} title="انتخاب motherboard">
                <Group>
                    {
                        motherboardSelected?.map(el => (
                            <Card onClick={() => selectedMotherboard(el.id)} key={el.id} className={cardClasses.hoverCard}
                                style={{ padding: '0 45px' }} radius="md" withBorder>
                                <Card.Section style={{ textAlign: 'center' }} mt={'md'}>

                                    {el.image && <Image alt={el.name} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${el.image}`} />}

                                </Card.Section>

                                <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                                    <Badge color="pink" variant="light">
                                        {el.brand}
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

export default Motherboard;
