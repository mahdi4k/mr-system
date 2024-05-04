import { Flex, Popover, Button, Card, Group, Badge, Text, Divider, Stack, Grid, Avatar, Tooltip, Modal, Box } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import AmdOrIntelFilter from '../filters/AmdOrIntelFilter'
import Image from 'next/image'
import LoadingCategorySkeleton from './LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import ModalItems from './modalItems'
import { useGetGraphicsQuery } from '@/_redux/services/graphicApi'
import { CPU } from '@/_redux/services/cpuApi'
import { POWER } from '@/_redux/services/powerApi'
import Link from 'next/link'
import classes from './category.module.css'
import CardPartPrice from '../shared/CardPartPrice'
import AmdOrNvidiaFilter from '../filters/AmdOrNvidiaFilter'
const GraphicCardCategory = () => {
  const [value, setValue] = useState<string[]>([]);
  const { isSuccess, data = [], error, isLoading } = useGetGraphicsQuery({ manufacturer: value })
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<CPU[] | POWER[]>()
  const [modalTitle, setModalTitle] = useState<string>('')
  const [modalType, setModalType] = useState<'cpus'|'powers'>()

  const openModal = (data: CPU[] | POWER[], name: string, type: 'cpus'|'powers') => {
    open()
    setModalData(data);
    setModalTitle(name)
    setModalType(type)

  }

  return (
    <>

      <Flex my={'md'} justify={'flex-end'}>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button variant='outline' styles={{ section: { marginLeft: '5px' } }} radius={'xl'} color="gray" leftSection={<IconChevronDown size={16} />} px='xl'>سازنده پردازنده گرافیکی</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <AmdOrNvidiaFilter value={value} setValue={setValue} />
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

            <Card className={classes.categoryCard} pos={'relative'} miw={'250px'} mih={375} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Link href={`/products/graphics/${data.id}`}>
                <Card.Section mt={'0'} ta={'center'}>
                  {data.image && <Image alt={data.name} width={180} height={170} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.image}`} />}
                </Card.Section>

                <Stack h={50} justify="start" align='center' mt="md" mb="xs">
                  <Text ta={'center'} fw={500}>{data.name}</Text>
                </Stack>

                <CardPartPrice price={data.price} />

              </Link>
              <Box pos={'absolute'} left={0} right={0} bottom={'2px'} component='div'>
                <Divider color='#d2d2d269' mb={'4px'} />
                <Group align='center' justify='center'>
                  <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='cpu مطابق'>
                    <Avatar onClick={(e) => { e.stopPropagation(); openModal(data.cpus, data.name, 'cpus'); }} style={{ cursor: 'pointer' }}><Image alt='graphic card' width={20} height={20} src={'/svg/cpu.svg'} /></Avatar>
                  </Tooltip>
                  <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='پاورهای مطابق'>
                    <Avatar onClick={() => openModal(data.powers, data.name, 'powers')} style={{ cursor: 'pointer' }}><Image alt='graphic card' width={20} height={25} src={'/svg/power.svg'} /></Avatar>
                  </Tooltip>
                </Group>
              </Box>
            </Card>

          </Grid.Col>

        ))}
      </Grid >

      <Modal opened={opened} size={'1300px'} onClose={close} title={` لیست ${modalType === 'powers' ? 'پاور' : ' cpu'}های مطابق با ${modalTitle}`}>
        <ModalItems type={modalType} items={modalData} />
      </Modal>
    </>
  )
}

export default GraphicCardCategory