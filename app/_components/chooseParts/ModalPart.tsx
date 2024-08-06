import { CASE, IResult } from '@/_redux/services/caseApi'
import { CPU } from '@/_redux/services/cpuApi'
import { FAN } from '@/_redux/services/fanApi'
import { Graphic } from '@/_redux/services/graphicApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import { POWER } from '@/_redux/services/powerApi'
import { RAM } from '@/_redux/services/ramApi'
import { SSD } from '@/_redux/services/ssdApi'
import { Card, Modal, SimpleGrid, Skeleton, Text } from '@mantine/core'
import React, { FC, useEffect, useState } from 'react'
import CategoryImage from '../category/components/CategoryImage'
import classes from './choosePart.module.css'
import CardPartPrice from '../shared/CardPartPrice'
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
    opened: boolean
    close: () => void
    ssdList: { data: SSD[] | undefined, isSuccessSsdList: boolean }
    cpuList: { data: CPU[] | undefined, isSuccessCpuList: boolean, motherboardData: CPU[] | undefined }
    ramList: { data: RAM[] | undefined, isSuccessRamList: boolean }
    caseList: { data: CASE[] | undefined, isSuccessCaseList: boolean }
    powerList: { data: POWER[] | undefined, isSuccessPowerList: boolean, graphicData: POWER[] | undefined }
    graphicList: { data: Graphic[] | undefined, isSuccessGraphicList: boolean, cpuData: Graphic[] | undefined }
    fanList: { data: FAN[] | undefined, isSuccessFanList: boolean, cpuData: FAN[] | undefined }
    motherboardList: { data: Motherboard[] | undefined, isSuccessMotherboardList: boolean, cpuData: Motherboard[] | undefined }
    type: string

}

type dataProp = {
    name: string
    id: number
    price?: string
    image: string
    links: string
}

const ModalPart: FC<Props> = ({ opened, close, ssdList, cpuList, ramList, caseList, powerList, graphicList, fanList, motherboardList, type }) => {

    const [dataList, setDataList] = useState<dataProp[] | undefined>([]);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (opened) {
            setDataList([])
        }

    }, [opened])


    useEffect(() => {
        if (type)
            switch (type) {
                case 'ssd':
                    if (ssdList.isSuccessSsdList)
                        setDataList(ssdList.data);
                    setModalTitle('انتخاب ssd')
                    break
                case 'cpu':
                    if (cpuList.motherboardData) {
                        setDataList(cpuList.motherboardData)
                    } else if (cpuList.isSuccessCpuList) {
                        setDataList(cpuList.data)
                    }
                    setModalTitle('انتخاب cpu')
                    break
                case 'ram':
                    if (ramList.isSuccessRamList)
                        setDataList(ramList.data)
                    setModalTitle('انتخاب رم')
                    break
                case 'case':
                    if (caseList.isSuccessCaseList)
                        setDataList(caseList.data)
                    setModalTitle('انتخاب کیس')
                    break
                case 'power':
                    if (powerList.graphicData) {
                        setDataList(powerList.graphicData)
                    } else if (powerList.isSuccessPowerList) {
                        setDataList(powerList.data)
                    }

                    setModalTitle('انتخاب پاور')
                    break
                case 'graphic':
                    if (graphicList.cpuData) {
                        setDataList(graphicList.cpuData)
                    } else if (graphicList.isSuccessGraphicList) {
                        setDataList(graphicList.data)
                    }

                    setModalTitle('انتخاب کارت گرافیک')
                    break
                case 'fan':
                    if (fanList.cpuData) {
                        setDataList(fanList.cpuData)
                    } else if (fanList.isSuccessFanList)
                        setDataList(fanList.data)
                    setModalTitle('انتخاب فن')
                    break
                case 'motherboard':
                    if (motherboardList.cpuData) {
                        setDataList(motherboardList.cpuData)
                    } else if (motherboardList.isSuccessMotherboardList) {
                        setDataList(motherboardList.data)
                    }
                    setModalTitle('انتخاب مادربرد')
                    break
                default:
                    break
            }
    }, [type, cpuList, caseList, fanList, graphicList, powerList, ramList, ssdList])

    const router = useRouter();
    const searchParams = useSearchParams();


    const handleCardClick = (id: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(type, `${id}`);
        router.push(`/choose-part?${params.toString()}`);
        close();
    };




    return (
        <Modal size={'1000px'} opened={opened} onClose={close} title={modalTitle}>

            <SimpleGrid spacing="lg" verticalSpacing="lg" py={'lg'} cols={{ base: 2, lg: 4 }}>
                {dataList && dataList.length > 0 ? dataList.map((item) => (
                    <Card onClick={() => handleCardClick(item.id)} key={item.id} className={classes.partItem}>
                        <Card.Section className={classes.categoryImage} mt={'0'} ta={'center'}>
                            {item.image && <CategoryImage img={item.image} alt={item.name} />}
                        </Card.Section>

                        <Text ta={'center'} mt={'lg'} size='md'>{item.name}</Text>
                        <CardPartPrice price={item.price} />

                    </Card>
                )) : ''}
            </SimpleGrid>
            {dataList?.length === 0 &&
                <SimpleGrid spacing="lg" verticalSpacing="lg" py={'lg'} cols={{ base: 2, lg: 4 }}>
                    <Skeleton height={260} mb="xl" />
                    <Skeleton height={260} mb="xl" />
                    <Skeleton height={260} mb="xl" />
                    <Skeleton height={260} mb="xl" />
                </SimpleGrid>}
        </Modal>
    )
}

export default ModalPart