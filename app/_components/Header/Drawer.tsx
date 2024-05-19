import { Drawer, List, ThemeIcon, rem, Text } from '@mantine/core'
import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  opened: boolean
  close: () => void
}

const DrawerHeader: FC<Props> = ({ opened, close }) => {
  return (
    <div>
      <Drawer withCloseButton={false} position="left" size={'xs'} opened={opened} onClose={close} title="">
        <Text mt={'lg'} mb={'lg'} fz={'xl'} fw={'bold'}>قطعات کامپیوتر</Text>
        <List
          spacing="md"
          size="sm"
          center

          icon={''}
        >
          <List.Item
            mb={'xl'}
            mt={'xl'}
            onClick={() => close()}
            icon={
              <Link style={{ marginBottom: '10px' }} href='/category/motherboard'>
                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={25} height={25} src={'/svg/motherboard.svg'} alt={'motherboard'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link style={{ marginBottom: '10px' }} href='/category/motherboard'>
              <Text fz={'lg'}> مادربرد</Text>
            </Link>
          </List.Item>

          <List.Item
            mb={'xl'}
            onClick={() => close()}
            icon={
              <Link href='/category/cpu'>

                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={25} height={25} src={'/svg/cpu.svg'} alt={'cpu'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link href='/category/cpu'>
              <Text fz={'lg'}> cpu</Text>
            </Link>
          </List.Item>


          <List.Item
            mb={'xl'}
            onClick={() => close()}
            icon={
              <Link href='/category/graphic'>
                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={25} height={25} src={'/svg/graphic.svg'} alt={'graphic'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link href='/category/graphic'>
              <Text fz={'lg'}> کارت گرافیک</Text>
            </Link>

          </List.Item>

          <List.Item
            onClick={() => close()}
            icon={
              <Link href='/category/power'>
                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={25} height={30} src={'/svg/power.svg'} alt={'power'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link href='/category/power'>
              <Text fz={'lg'}> پاور</Text>
            </Link>

          </List.Item>
        </List>
      </Drawer>

    </div >
  )
}

export default DrawerHeader