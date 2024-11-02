import { Flex, Popover, Button, Card, Group, Badge, Text, Divider, Stack, Grid, Avatar, Tooltip, Modal, Box, ActionIcon, rem, TextInput } from '@mantine/core'
import { IconChevronDown, IconSearch } from '@tabler/icons-react'
import React, { useState } from 'react'
import LoadingCategorySkeleton from './components/LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import ModalItems from './components/modalItems'
import { useGetCasesQuery } from '@/_redux/services/caseApi'
import { Graphic } from '@/_redux/services/graphicApi'
import PowerModularFilter from '../filters/PowerModularFilter'
import CategoryLayout from './CategoryLayout'
import { theme } from '../../../theme'

const CaseCategory = () => {
    const [value, setValue] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchSubmit, setSearchSubmit] = useState<string>('');

    const { isSuccess, data = [], error, isLoading } = useGetCasesQuery({ search: searchSubmit })
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

            <Flex my={'md'} justify={'space-between'}>
                <TextInput mt={'2px'}
                    mb={{ base: 'lg', lg: '0' }}
                    radius="xl"
                    w={260}
                    onKeyDown={e => e.key === 'Enter' ? setSearchSubmit(searchValue) : ''}
                    size="sm"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="جستجو در نتایج"
                    rightSectionWidth={42}
                    rightSection={
                        <ActionIcon onClick={() => setSearchSubmit(searchValue)} size={32} radius="xl" color={theme.primaryColor} variant="light">
                            <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                        </ActionIcon>
                    }
                />
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