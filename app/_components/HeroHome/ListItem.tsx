
"use client"
import { List, ThemeIcon } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
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
             قبل از خرید، بهترین گزینه و قیمت رو از ترب و ایمالز بررسی کن! 
            </List.Item>
        </List>
    )
}

export default ListItem