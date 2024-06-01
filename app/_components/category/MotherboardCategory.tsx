import { Flex, Popover, Button, Card, Group, Badge, Text, Divider, Stack, Grid, Avatar, Tooltip, Modal, Box } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import AmdOrIntelFilter from '../filters/AmdOrIntelFilter'
import { CPU } from '@/_redux/services/cpuApi'
import Image from 'next/image'
import LoadingCategorySkeleton from './components/LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import ModalItems from './components/modalItems'
import { useGetMotherboardsQuery } from '@/_redux/services/motherboardApi'
import Link from 'next/link'
import classes from './category.module.css'
import CardPartPrice from '../shared/CardPartPrice'
import CategoryLayout from './CategoryLayout'

const MotherboardCategory = () => {
  const [value, setValue] = useState<string[]>([]);
  const { isSuccess, data = [], error, isLoading } = useGetMotherboardsQuery({ manufacturer: value })
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<CPU[]>()
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalType, setModalType] = useState<'motherboards'>()

  const openModal = (data: CPU[], name: string, type: 'motherboards') => {
    open()
    setModalTitle(name)
    setModalType(type)
    setModalData(data);
  }

  return (
    <>

      <Flex my={'md'} justify={'flex-end'}>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button variant='outline' styles={{ section: { marginLeft: '5px' } }} radius={'xl'} color="gray" leftSection={<IconChevronDown size={16} />} px='xl'>نوع سوکت</Button>
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
          <CategoryLayout type={'motherboards'} key={data.id} data={data} children={
            (
              <Box pos={'absolute'} left={0} right={0} bottom={'2px'} component='div' >
                <Divider color='#d2d2d269' mb={'4px'} />

                <Group align='center' justify='center'>
                  <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='cpu های مطابق'>
                    <Avatar onClick={() => openModal(data.cpus, data.name, 'motherboards')} style={{ cursor: 'pointer' }}><Image alt='graphic card' width={20} height={20} src={'/svg/cpu.svg'} /></Avatar>
                  </Tooltip>
                </Group>
              </Box>
            )
          } />
        ))}
      </Grid>

      <Modal opened={opened} size={'1300px'}  onClose={close} >
        <ModalItems title={`لیست cpu های مطابق با ${modalTitle}`} type={modalType} items={modalData} />
      </Modal>
    </>
  )
}

export default MotherboardCategory