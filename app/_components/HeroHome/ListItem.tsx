
"use client"
import { Group, List, Text, ThemeIcon } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

const ListItem = () => {
    return (
        <List
            mt={30}
            spacing="lg"
            size="sm"
            icon={
                <ThemeIcon color='#A08556'
                    size={20} radius="xl">
                    <IconCheck />
                </ThemeIcon>
            }
        >
            <List.Item style={{ lineHeight: '25px' }}>
                <Group gap={'4px'}>
                    قطعاتت رو با اطمینان <Text c={'var(--mantine-color-green-9)'} fz={'sm'}><Link href={'/choose-part'}>انتخاب کن</Link></Text> و بابت گلوگاه خیالت راحت باشه
                </Group>
            </List.Item>
            <List.Item>
                به راحتی <Link href={'/ads/create'}>آگهی ثبت کن</Link> و قطعات مورد نیازت رو با بهترین قیمت <Link href={'/ads'}>پیدا کن</Link>!
            </List.Item>
            <List.Item>
                <Group gap={'2px'}>
                    <Text fz={'14px'}>قبل از خرید، بهترین گزینه</Text> <Text c={'var(--mantine-color-green-9)'} fz={'xs'}>(<Link style={{ marginRight: '3px', marginLeft: '3px' }} href={'/category/cpu'}>cpu</Link>,<Link style={{ marginRight: '3px', marginLeft: '3px' }} href={'/category/motherboard'}>مادربرد</Link>,<Link style={{ marginRight: '3px', marginLeft: '3px' }} href={'/category/graphic'}>کارت گرافیک</Link>,...)</Text><Text fz={'14px'}>و قیمت رو از ترب و ایمالز بررسی کن</Text></Group>
            </List.Item>
        </List>
    )
}

export default ListItem