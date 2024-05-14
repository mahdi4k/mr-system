import { Button, Flex, Group, TextInput, Textarea } from '@mantine/core'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import React, { useState } from 'react'
import notifCalsses from "@/_cssModules/notification.module.css";

const CommentPost = ({ postID }: { postID: string }) => {
    const [loading, setLoading] = useState(false)
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            text: ''
        },
        validate: {
            email: isEmail('لطفا ایمیل خود را وارد کنید'),
            name: isNotEmpty('لطفا نام خود را وارد کنید'),
            text: isNotEmpty('لطفا پیام خود را وارد کنید')
        },
        validateInputOnBlur: true
    })

    const handleSubmit = async () => {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/comments?post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: postID,
                author_name: form.values.name,
                author_email: form.values.email,
                content: form.values.text
            })
        });

        if (response.status === 201) {
            notifications.show({
                color: 'green',
                title: 'پیام شما با موفقیت ارسال شد و پس از بررسی ادمین در سایت قرار خواهد گرفت',
                message: '',
                autoClose: 8000,
                classNames: notifCalsses
            })
        }
        if (response.status === 400) {
            notifications.show({
                color: 'red',
                title: 'در ارسال پیام خطایی رخ داده است لطفا دوباره تلاش کنید',
                message: '',
                autoClose: 8000,
                classNames: notifCalsses
            })
        }

        const result = await response.json();
        setLoading(false)

    };
    return (
        <form onSubmit={form.onSubmit((event) => { handleSubmit() })}>
            <Group wrap='nowrap'>
                <TextInput styles={{ error: { position: 'absolute' } }} {...form.getInputProps('name')} withAsterisk w={'100%'} label="نام" />
                <TextInput styles={{ error: { position: 'absolute' } }} {...form.getInputProps('email')} withAsterisk w={'100%'} label="ایمیل" />
            </Group>
            <Textarea {...form.getInputProps('text')} styles={{ input: { height: '100px' } }} withAsterisk mt={'lg'} label="متن پیام"></Textarea>
            <Flex mt={'lg'} justify={'flex-end'}>
                <Button loading={loading} type='submit' color="blue" variant="outline">ارسال پیام</Button>
            </Flex>
        </form>
    )
}

export default CommentPost