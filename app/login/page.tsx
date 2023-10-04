"use client"
import React, { useEffect } from 'react'
import {
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
} from '@mantine/core';
import classes from './login.module.css';
import { isNotEmpty, useForm } from '@mantine/form';
import { signIn, useSession, signOut } from "next-auth/react";
import { notifications } from '@mantine/notifications';
import notifCalsses from '../cssModules/notification.module.css'
import { redirect } from 'next/navigation'

const Page = () => {
    const data = useSession()
    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },

        validate: {
            username: isNotEmpty(),
            password: isNotEmpty()
        },
    });

    useEffect(() => {
        if (data.status === 'authenticated') {
            redirect('/dashboard')
        }
    }, [data.status])

    const submitHandle = async (event: React.MouseEvent) => {
        event.preventDefault()
        const result = await signIn("credentials", {
            username: form.values.username,
            password: form.values.password,
            redirect: false,
        }).then(val => {
            notifications.show({
                color: 'red',
                title: 'نام کاربری یا رمز عبور اشتباه است',
                message: '',
                classNames: notifCalsses
            })
        })

    }
    const logout = () => {
        signOut()
    }
    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Button onClick={logout}>logout</Button>
                <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                    mr-system login
                </Title>
                <form>
                    <TextInput  {...form.getInputProps('username')}
                        label="username" placeholder="" size="md" />
                    <PasswordInput {...form.getInputProps('password')}
                        label="Password" placeholder="Your password" mt="md" size="md" />
                    <Button onClick={submitHandle} type='submit' fullWidth mt="xl" size="md">
                        Login
                    </Button>
                </form>

            </Paper>
        </div>
    )
}

export default Page
