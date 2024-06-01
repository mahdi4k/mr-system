import { Flex, Popover, Button, Group, Divider, Grid, Avatar, Tooltip, Modal, Box } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import AmdOrIntelFilter from '../filters/AmdOrIntelFilter'
import { useGetCpusQuery } from '@/_redux/services/cpuApi'
import Image from 'next/image'
import LoadingCategorySkeleton from './components/LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import { Graphic } from '@/_redux/services/graphicApi'
import ModalItems from './components/modalItems'
import { Motherboard } from '@/_redux/services/motherboardApi'
import CategoryLayout from './CategoryLayout'
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
                    <CategoryLayout type={'cpus'} key={data.id} data={data} children={
                        (
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
                        )
                    } />

                ))}
            </Grid>

            <Modal opened={opened} size={'900px'} onClose={close} >
                <ModalItems
                    type={modalType}
                    items={modalData}
                    title={` لیست ${modalType === 'graphics' ? 'کارت گرافیک‌' : ' مادربرد'}های مطابق با ${modalTitle}`}
                />
            </Modal>
        </>
    )
}

export default CpuCategory