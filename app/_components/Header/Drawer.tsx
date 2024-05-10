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
      <Drawer position="left" size={'xs'} opened={opened} onClose={close} title="">
        <Text mb={'lg'} fw={'bold'}>قطعات کامپیوتر</Text>
        <List
          spacing="md"
          size="sm"
          center

          icon={''}
        >
          <List.Item
            onClick={() => close()}
            icon={
              <Link style={{ marginBottom: '10px' }} href='/category/motherboard'>
                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={20} height={20} src={'/svg/motherboard.svg'} alt={'motherboard'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link style={{ marginBottom: '10px' }} href='/category/motherboard'>
              مادربرد
            </Link>
          </List.Item>

          <List.Item
            onClick={() => close()}
            icon={
              <Link href='/category/cpu'>

                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={20} height={20} src={'/svg/cpu.svg'} alt={'cpu'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link href='/category/cpu'>
              cpu
            </Link>
          </List.Item>


          <List.Item
            onClick={() => close()}
            icon={
              <Link href='/category/graphic'>
                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={20} height={20} src={'/svg/graphic.svg'} alt={'graphic'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link href='/category/graphic'>
              کارت گرافیک
            </Link>

          </List.Item>

          <List.Item
            onClick={() => close()}
            icon={
              <Link href='/category/power'>
                <ThemeIcon variant='transparent' size={24} radius="xl">
                  <Image width={20} height={20} src={'/svg/power.svg'} alt={'power'} />
                </ThemeIcon>
              </Link>
            }
          >
            <Link href='/category/power'>
              پاور
            </Link>

          </List.Item>
        </List>
      </Drawer>

    </div >
  )
}

export default DrawerHeader