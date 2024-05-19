
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
            <List.Item style={{lineHeight:'25px'}}>
                 میتونی قبل از خرید قطعات خیالت بابت گلوگاه و یا این که بهترین قطعات براساس بودجه‌‌ات انتخاب کردی , راحت کنی  
            </List.Item>
            <List.Item>
            میخوای بدونی چه cpu برای سیستمت بگیری ؟ جای درستی اومدی
            </List.Item>
            <List.Item>
                 یا میخوای مانیتور بگیری ولی دقیقا نمیدونی چی بگیری
            </List.Item>
        </List>
    )
}

export default ListItem