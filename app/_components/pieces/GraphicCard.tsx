"use client"

import React, { FC, useEffect, useState } from 'react';
import classes from "./pieces.module.css";
import { Badge, Card, Drawer, Flex, Grid, Group, Tabs, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";
import { useDisclosure } from "@mantine/hooks";
import { CPU } from "@/_redux/services/cpuApi";
import { useDispatch, useSelector } from 'react-redux';
import { addselectedCpu, relatedGraphicList, relatedMotherboardList } from '@/_redux/features/cpu';
import { RootState } from '@/_redux/store';
import { ObjectIsEmpty } from '@/_utils/utils';
import { IconBuildingStore, IconExclamationCircle, IconListDetails, IconX } from '@tabler/icons-react';
import useLoading from '@/_utils/customHook/useLoading';
import { Graphic, useGetGraphicsQuery } from '@/_redux/services/graphicApi';
import { addselectedGraphic, relatedCpuList } from '@/_redux/features/graphic';

export type IgraphicProps = {
    setActiveGraphic:  React.Dispatch<React.SetStateAction<Partial<Graphic> | undefined>>
    activeGraphic: Partial<Graphic> | undefined
}
const GraphicCard : FC<IgraphicProps> = ({setActiveGraphic,activeGraphic}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [graphicSelected, setSelectedGraphic] = useState<Graphic[]>()
    const dispatch = useDispatch()
    const loadingEnd  = useLoading();

    
     
    const graphicListFromSelectedCpu = useSelector((state: RootState) => state.cpu.relatedGraphic);
    const graphicListFromSelectedPower = useSelector((state: RootState) => state.power.relatedGraphic);
    const { isSuccess, data = [], error, } = useGetGraphicsQuery({});
    const currentGraphic = useSelector((state: RootState) => state.graphic.selectedGraphic);
    const selectedPower = useSelector((state: RootState) => state.power.selectedPower);
    useEffect(()=>{
        if(loadingEnd){
            setActiveGraphic(currentGraphic)
        }
    },[loadingEnd,currentGraphic])
    const selectedGraphic = (id: number) => {
        const graphic = data.find(el => el.id === id)
        if (graphic) {
            dispatch(addselectedGraphic(graphic))
            relatedCpu(graphic)
        }
        close()
    }

    const relatedCpu = (graphic: Graphic) => {
        dispatch(relatedCpuList(graphic.cpus))
    }

    const removeSelected = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addselectedGraphic({}))
        dispatch(relatedMotherboardList([]))
        dispatch(relatedGraphicList([]))

    }
    const titleDrawer = () => {
        return (
            ObjectIsEmpty(selectedPower) ? 'لیست کارت گرافیک' :
                <Flex align={'center'} justify={'center'}>
                    لیست cpu سازگار با مادربرد
                    <Text mr={'sm'} fw={'bolder'}> {selectedPower.name}</Text>
                </Flex>
        )
    }
    useEffect(() => {
        setSelectedGraphic(graphicListFromSelectedCpu.length ? graphicListFromSelectedCpu : data);
    }, [graphicListFromSelectedCpu, isSuccess])

    useEffect(() => {
        setSelectedGraphic(graphicListFromSelectedPower.length ? graphicListFromSelectedPower : data);
    }, [graphicListFromSelectedPower, isSuccess])


    return (
        <>
            <div onClick={open} className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentGraphic) ? (
                    <Flex className={classes.hoverCard} mb={'lg'} align={'center'} justify={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fw={"bold"}>کارت گرافیک</Text>
                        <Image className={classes.piecesImg} width={110} height={60} src={'/svg/graphic.svg'} alt={'cpu'} />
                    </Flex>
                ) : (
                    <Card style={{ padding: '0 35px', marginTop: '20px', width: '195px' }} radius="md" shadow='md'>
                        <IconX onClick={removeSelected} size={18} style={{ position: 'absolute', right: '4px', top: '3px' }} />
                        <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                            {currentGraphic.image && <Image alt={currentGraphic.name ? currentGraphic.name : ''} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentGraphic.image}`} />}
                        </Card.Section>
                        <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                            <Badge color="pink" variant="light">
                                {currentGraphic.manufacturer}
                            </Badge>
                            <Text fz={"sm"} mt={'md'}>{currentGraphic.name}</Text>
                        </Flex>
                    </Card>
                )}

                {ObjectIsEmpty(currentGraphic) ? '' : (
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
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}>{currentGraphic.brand}</Text></Grid.Col>

                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>نسل رم قابل پشتیبانی</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}>
                                    <Flex align={'center'}>
                                        <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}> DDR4</Text>
                                        <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}> DDR3</Text>
                                    </Flex>
                                </Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>فرکانس‌های رم قابل پشتیبانی</Text></Grid.Col>
                                <Grid.Col className={`${classes.borderBottomDashed} ${classes.dFlex}`} span={6}>{currentGraphic.attributes?.map(el => (
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
                                        label="در هنگام خرید رم به حداکثر فرکانس قابل پشتیبانی دقت کنید. درصورتی که رم با فرکانس بالاتر از مقدار گفته شده خریداری کنید فرکانس به حداکثر مقدار مادربرد بازگردانده میشود و عملا هزینه اضافی کرده‌اید "
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
                        graphicSelected?.map(el => (
                            <Card onClick={() => selectedGraphic(el.id)} key={el.id} className={cardClasses.hoverCard}
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

export default GraphicCard;

