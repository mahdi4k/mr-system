import { Flex, Popover, Button, Card, Group, Badge, Text, Divider, Stack, Grid, Avatar, Tooltip, Modal } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import AmdOrIntelFilter from '../filters/AmdOrIntelFilter'
import Image from 'next/image'
import LoadingCategorySkeleton from './LoadingCategorySkeleton'
import { useDisclosure } from '@mantine/hooks'
import ModalItems from './modalItems'
import { Graphic, useGetGraphicsQuery } from '@/_redux/services/graphicApi'
import { CPU } from '@/_redux/services/cpuApi'
import { POWER } from '@/_redux/services/powerApi'
const GraphicCardCategory = () => {
  const [value, setValue] = useState<string[]>([]);
  const { isSuccess, data = [], error, isLoading } = useGetGraphicsQuery()
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<CPU[] | POWER[]>()

  const openModal = (data: CPU[] | POWER[]) => {
    open()
    setModalData(data);
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
      <Divider color='#eee' mb={'md'} />

      {isLoading ? <>
        <LoadingCategorySkeleton />
      </> : ''}
      <Grid mb='xl' >
        {data && data.map((data) => (
          <Grid.Col key={data.id} span={{ base: 12, md: 6, lg: 3 }}>
            <Card miw={'250px'} mih={352} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section mt={'0'} ta={'center'}>
                {data.image && <Image alt={data.name} width={180} height={170} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.image}`} />}
              </Card.Section>

              <Stack justify="center" align='center' mt="md" mb="xs">
                <Badge color="pink">{data.brand}</Badge>
                <Text fw={500}>{data.name}</Text>
              </Stack>
              <Group align='center' justify='center'>
                <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='کارت گرافیک‌های مطابق'>
                  <Avatar onClick={() => openModal(data.cpus)} style={{ cursor: 'pointer' }}><Image alt='graphic card' width={20} height={20} src={'/svg/cpu.svg'} /></Avatar>
                </Tooltip>
                <Tooltip styles={{ tooltip: { fontSize: '12px' } }} position="bottom" label='کارت گرافیک‌های مطابق'>
                  <Avatar onClick={() => openModal(data.powers)} style={{ cursor: 'pointer' }}><Image alt='graphic card' width={20} height={20} src={'/svg/power.svg'} /></Avatar>
                </Tooltip>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal opened={opened} size={'1300px'} onClose={close} title=" ">
        <ModalItems items={modalData} />
      </Modal>
    </>
  )
}

export default GraphicCardCategory