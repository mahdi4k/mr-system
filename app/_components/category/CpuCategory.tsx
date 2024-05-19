import { Flex, Popover, Button, Card, Group, Badge, Text, Divider, Stack, Grid, Avatar, Tooltip, Modal, Box } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import AmdOrIntelFilter from '../filters/AmdOrIntelFilter'
import { useGetCpusQuery } from '@/_redux/services/cpuApi'
import Image from 'next/image'
import LoadingCategorySkeleton from './LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import { Graphic } from '@/_redux/services/graphicApi'
import ModalItems from './modalItems'
import { Motherboard } from '@/_redux/services/motherboardApi'
import classes from './category.module.css'
import Link from 'next/link'
import CardPartPrice from '../shared/CardPartPrice'
const CpuCategory = () => {
    const [value, setValue] = useState<string[]>([]);
    const { isSuccess, data = [], error, isLoading } = useGetCpusQuery({ manufacturer: value })
    const [opened, { open, close }] = useDisclosure(false);
    const [modalData, setModalData] = useState<Graphic[] | Motherboard[]>()
    const [modalTitle, setModalTitle] = useState<string>('')
    const [modalType, setModalType] = useState<'motherboards' | 'graphics'>()

    const openModal = (data: Graphic[] | Motherboard[], name: string, type: 'motherboards' | 'graphics') => {
        open()
        setModalData(data);
        setModalTitle(name);
        setModalType(type)

    }



    return (
        <>

            <Flex my={'md'} justify={'flex-end'}>
                <Popover width={200} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <Button variant='outline' styles={{ section: { marginLeft: '5px' } }} radius={'xl'} color="gray" leftSection={<IconChevronDown size={16} />} px='xl'>سازنده</Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <AmdOrIntelFilter value={value} setValue={setValue} />
                    </Popover.Dropdown>
                </Popover>
            </Flex>
            <Divider color='#d2d2d269' mb={'md'} />

            {isLoading ? <>
                <LoadingCategorySkeleton />
            </> : ''}
            <Grid pb='md' mb='xl' >
                {data && data.map((data) => (
                    <Grid.Col key={data.id} span={{ base: 12, md: 6, lg: 3 }}>
                        <Card className={classes.categoryCard} mih={375} miw={'250px'} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
                            <Link href={`/products/cpus/${data.id}`}>
                                <Card.Section ta={'center'}>
                                    {data.image && <Image alt={data.name} width={180} height={170} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.image}`} />}
                                </Card.Section>

                                <Stack h={50} justify="start" align='center' mt="md" mb="xs">
                                    <Text ta={'center'} fw={500}>{data.name}</Text>
                                </Stack>
                                <CardPartPrice price={data.price} />
                            </Link>


                            <Box pos={'absolute'} left={0} right={0} bottom={'2px'} component='div' >
                                <Divider color='#d2d2d269' mb={'4px'} />
                                <Group align='center' justify='center'>
                                    <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='کارت گرافیک‌های مطابق'>
                                        <Avatar onClick={() => openModal(data.graphics, data.name, 'graphics')} style={{ cursor: 'pointer' }}><Image alt='graphic card' width={20} height={20} src={'/svg/graphic.svg'} /></Avatar>
                                    </Tooltip>
                                    <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='مادربردهای مطابق'>
                                        <Avatar onClick={() => openModal(data.motherboards, data.name, 'motherboards')} style={{ cursor: 'pointer' }}><Image alt='motherboard' width={20} height={20} src={'/svg/motherboard.svg'} /></Avatar>
                                    </Tooltip>
                                </Group>
                            </Box>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>

            <Modal opened={opened} size={'xl'} onClose={close} styles={{title:{marginTop:'10px',lineHeight:'28px',marginLeft:'20px'},header:{alignItems:'baseline'},close:{position:'relative',top:'-10px'}}} title={` لیست ${modalType === 'graphics' ? 'کارت گرافیک‌' : ' مادربرد'}های مطابق با ${modalTitle}`}>
                <ModalItems type={modalType} items={modalData} />
            </Modal>
        </>
    )
}

export default CpuCategory