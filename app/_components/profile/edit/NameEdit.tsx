import { Button, Group, Modal, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { FC } from 'react'
import notifClasses from "@/_cssModules/notification.module.css";

type props = {
    opened: boolean,
    close: () => void,
    token?: string
    fetchUserData?: () => Promise<void>
}

const NameEdit: FC<props> = ({ opened, close, token, fetchUserData }) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            termsOfService: false,
        },

        validate: {
            name: isNotEmpty('فیلد نام الزامی است')
        },
    });


    const handleSubmit = async (values: typeof form.values) => {


        try {
            const response = await fetch(`/api/profile-edit`, {
                method: 'PATCH',
                body: JSON.stringify({ name: values.name }),
                headers: {
                    Authorization: `Bearer ${token}`, // Replace with your token
                },
            });
            if (!response.ok) {
                // The request failed, check for specific status codes
                const errorMessage = await response.text(); // Extract the error message
                if (response.status === 419) {
                    console.error('CSRF Token Mismatch: Error 419');
                    notifications.show({
                        color: 'red',
                        title: 'خطایی رخ داده است لطفا دوباره تلاش کنید',
                        message: '',
                        classNames: notifClasses
                    })
                } else {
                    console.error(`Error ${response.status}: ${errorMessage}`);
                    notifications.show({
                        color: 'red',
                        title: 'خطایی رخ داده است لطفا دوباره تلاش کنید',
                        message: '',
                        classNames: notifClasses
                    })
                }
                return; // Prevent the success flow when there's an error
            } else {
                fetchUserData?.();
                notifications.show({
                    color: 'green',
                    title: 'نام شما با موفقیت ویرایش شد',
                    message: '',
                    classNames: notifClasses
                })
                close();
 
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };
    return (
        <div>
            <Modal opened={opened} onClose={close} title="ویرایش نام ">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput {...form.getInputProps('name')} placeholder='نام ' />
                    <Group justify="flex-end" mt="md">
                        <Button type="submit">ویرایش</Button>
                    </Group>
                </form>
            </Modal>

        </div >
    )
}

export default NameEdit