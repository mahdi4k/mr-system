import { Flex, Popover, Button, Card, Group, Badge, Text, Divider, Stack, Grid, Avatar, Tooltip, Modal, Box } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import LoadingCategorySkeleton from './components/LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import ModalItems from './components/modalItems'
import { useGetCasesQuery } from '@/_redux/services/caseApi'
import { Graphic } from '@/_redux/services/graphicApi'
import PowerModularFilter from '../filters/PowerModularFilter'
import CategoryLayout from './CategoryLayout'

const CaseCategory = () => {
    const [value, setValue] = useState<string[]>([]);
    const { isSuccess, data = [], error, isLoading } = useGetCasesQuery({ modular: value })
    const [opened, { open, close }] = useDisclosure(false);
    const [modalData, setModalData] = useState<Graphic[]>()
    const [modalTitle, setModalTitle] = useState<string>('')
    const [modalType, setModalType] = useState<'graphics'>()


    const openModal = (data: Graphic[], name: string, type: 'graphics') => {
        open()
        setModalData(data);
        setModalTitle(name)
        setModalType(type)

    }

    return (
        <>

            <Flex my={'md'} justify={'flex-end'}>
                <Popover width={350} position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <Button variant='outline' styles={{ section: { marginLeft: '5px' } }} radius={'xl'} color="gray" leftSection={<IconChevronDown size={16} />} px='xl'>نوع کابل کشی</Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <PowerModularFilter value={value} setValue={setValue} />
                    </Popover.Dropdown>
                </Popover>
            </Flex>
            <Divider color='#d2d2d269' mb={'md'} />

            {isLoading ? <>
                <LoadingCategorySkeleton />
            </> : ''}
            <Grid pb='md' mb={'xl'} >
                {data && data.map((data) => (
                    <CategoryLayout key={data.id} type={'cases'} data={data} children={
                        (
                            <Box pos={'absolute'} left={0} right={0} bottom={'2px'} component='div' >
                                <Divider color='#d2d2d269' mb={'4px'} />

                                <Group align='center' justify='center'>
                                </Group>
                            </Box>
                        )
                    } />

                ))}
            </Grid>

            <Modal opened={opened} size={'1300px'} onClose={close} >
                <ModalItems title={`لیست کارت گرافیک‌های مطابق با ${modalTitle}`} type={modalType} items={modalData} />
            </Modal>
        </>
    )
}

export default CaseCategory