
"use client"
import { Group, List, Text, ThemeIcon } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'

const ListItem = () => {
    return (
        <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
                <ThemeIcon color='#A08556'
                    size={20} radius="xl">
                    <IconCheck />
                </ThemeIcon>
            }
        >
            <List.Item style={{ lineHeight: '25px' }}>
                قطعاتت رو با اطمینان انتخاب کن و بابت گلوگاه خیالت راحت باشه
            </List.Item>
            <List.Item>
                به راحتی آگهی ثبت کن و قطعات مورد نیازت رو با بهترین قیمت پیدا کن!
            </List.Item>
            <List.Item>
                <Group gap={'2px'}>
                    قبل از خرید، بهترین گزینه <Text fz={'xs'}><Link href={''}>cpu</Link>,<Link href={''}>مادربرد</Link>,<Link href={''}>کارت گرافیک</Link>,...</Text>و قیمت رو از ترب و ایمالز بررسی کن!
                </Group>
            </List.Item>
        </List>
    )
}

export default ListItem