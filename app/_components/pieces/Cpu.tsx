"use client"


import React, { FC, useEffect, useState } from 'react';
import classes from "./pieces.module.css";
import { Badge, Card, Drawer, Flex, Grid, Group, Tabs, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";
import { useDisclosure } from "@mantine/hooks";
import { CPU, useGetCpusQuery } from "@/_redux/services/cpuApi";
import { useDispatch, useSelector } from 'react-redux';
import { addselectedCpu, relatedMotherboardList } from '@/_redux/features/cpu';
import { RootState } from '@/_redux/store';
import { ObjectIsEmpty } from '@/_utils/utils';
import { IconBuildingStore, IconExclamationCircle, IconListDetails, IconX } from '@tabler/icons-react';
import useLoading from '@/_utils/customHook/useLoading';

export type IcpuProps = {
    setActiveCpu:  React.Dispatch<React.SetStateAction<Partial<CPU> | undefined>>
    activeCpu: Partial<CPU> | undefined
}
const Cpu : FC<IcpuProps> = ({setActiveCpu,activeCpu}) => {
    const [opened, { open, close }] = useDisclosure(false);
    // const { isSuccess, data = [], error } = useGetCpusQuery(undefined, { skip: !loadingSession })
    const [cpuSelected, setSelectedCpu] = useState<CPU[]>()
    const dispatch = useDispatch()
    const loadingEnd  = useLoading();

    
     
    const cpuListFromSelectedMotherboard = useSelector((state: RootState) => state.motherboard.relatedCpu);
    const { isSuccess, data = [], error, } = useGetCpusQuery();
    const currentCpu = useSelector((state: RootState) => state.cpu.selectedCpu);
    const selectedMotherboard = useSelector((state: RootState) => state.motherboard.selectedMotherboard);
    useEffect(()=>{
        if(loadingEnd){
            setActiveCpu(currentCpu)
            console.log('is run');
            
        }
    },[loadingEnd,currentCpu])
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

    const removeSelected = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addselectedCpu({}))
        dispatch(relatedMotherboardList([]))
    }
    const titleDrawer = () => {
        return (
            ObjectIsEmpty(selectedMotherboard) ? 'لیست cpu' :
                <Flex align={'center'} justify={'center'}>
                    لیست cpu سازگار با مادربورد
                    <Text mr={'sm'} fw={'bolder'}> {selectedMotherboard.name}</Text>
                </Flex>
        )
    }
    useEffect(() => {
        setSelectedCpu(cpuListFromSelectedMotherboard.length ? cpuListFromSelectedMotherboard : data);
    }, [cpuListFromSelectedMotherboard, isSuccess])


    return (
        <>
            <div onClick={open} className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentCpu) ? (
                    <Flex className={classes.hoverCard} mb={'lg'} align={'center'} justify={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fw={"bold"}>CPU</Text>
                        <Image className={classes.piecesImg} width={60} height={60} src={'/svg/cpu.svg'} alt={'cpu'} />
                    </Flex>
                ) : (
                    <Card style={{ padding: '0 35px', marginTop: '20px', width: '195px' }} radius="md" shadow='md'>
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

                {ObjectIsEmpty(currentCpu) ? '' : (
                    <Tabs onClick={(e) => e.stopPropagation()} className={classes.tabSection} defaultValue="info">
                        <Tabs.List>
                            <Tabs.Tab value="info" rightSection={<IconListDetails size={18} />}>
                                مشخصات
                            </Tabs.Tab>
                            <Tabs.Tab value="shop" rightSection={<IconBuildingStore size={18} />}>
                                فروشگاه
                            </Tabs.Tab>

                        </Tabs.List>

                        <Tabs.Panel value="info">
                            <Grid my={'md'}>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>گرافیک مجتمع</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}>{currentCpu.cpu_socket}</Text></Grid.Col>

                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>نسل رم قابل پشتیبانی</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}>
                                    <Flex align={'center'}>
                                        <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}> DDR4</Text>
                                        <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}> DDR3</Text>
                                    </Flex>
                                </Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>فرکانس‌های رم قابل پشتیبانی</Text></Grid.Col>
                                <Grid.Col className={`${classes.borderBottomDashed} ${classes.dFlex}`} span={6}>{currentCpu.attributes?.map(el => (
                                    <Tooltip
                                        key={el}
                                        withArrow
                                        transitionProps={{ duration: 400 }}
                                        label="خرید"
                                    >
                                        <Text className={classes.Badge} fw={'bold'} fz={'xs'}>{el}</Text>
                                    </Tooltip>
                                ))}
                                    <Tooltip
                                        multiline
                                        w={420}
                                        withArrow
                                        transitionProps={{ duration: 400 }}
                                        label="در هنگام خرید رم به حداکثر فرکانس قابل پشتیبانی دقت کنید. درصورتی که رم با فرکانس بالاتر از مقدار گفته شده خریداری کنید فرکانس به حداکثر مقدار مادربورد بازگردانده میشود و عملا هزینه اضافی کرده‌اید "
                                    >
                                        <IconExclamationCircle color='green' />
                                    </Tooltip>
                                </Grid.Col>

                            </Grid>
                        </Tabs.Panel>
                        <Tabs.Panel value="shop">
                            Messages tab content
                        </Tabs.Panel>
                    </Tabs>
                )}
            </div>
            <Drawer position={"bottom"} opened={opened} onClose={close} title={titleDrawer()}>

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

