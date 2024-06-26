"use client"

import React, { useEffect } from 'react';
import {
    Button,
    Flex,
    Grid,
    Group,
    Radio,
    Select,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import { currentSsdOnSave } from "@/_redux/features/ssd";
import { useDispatch } from "react-redux";
import { useCreateSsdMutation, useGetSsdQuery, useUpdateSsdMutation } from '@/_redux/services/ssdApi';
import { useGetMotherboardsQuery } from '@/_redux/services/motherboardApi';
import { StepProps } from '(routes)/dashboard/(pcParts)/motherboard/add/step1-form';
import { useParams } from 'next/navigation';


const Step1Form = (props: StepProps) => {
    const [updateSsd, response] = useUpdateSsdMutation();
    const { isSuccess, data = [], error } = useGetMotherboardsQuery({})
    const router = useParams();
    const { data: ssdData, isSuccess: isSuccessSsd } = useGetSsdQuery({ id: router.id as string })
    useEffect(() => {
        if (isSuccessSsd) {
            form.setInitialValues({
                name: ssdData.data.name,
                size: ssdData.data.size,
                read: ssdData.data.read,
                write: ssdData.data.write,
                age: ssdData.data.age,
                brand: ssdData.data.brand ? ssdData.data.brand : '',
                form: ssdData.data.form,
                emalls: ssdData.data.links ? JSON.parse(ssdData.data.links)[1] : '',
                torob: ssdData.data.links ? JSON.parse(ssdData.data.links)[0] : '',
                price: ssdData.data.price ? ssdData.data.price : '',

            })
            form.setValues({
                name: ssdData.data.name,
                size: ssdData.data.size,
                read: ssdData.data.read,
                write: ssdData.data.write,
                age: ssdData.data.age,
                brand: ssdData.data.brand ? ssdData.data.brand : '',
                form: ssdData.data.form,
                emalls: ssdData.data.links ? JSON.parse(ssdData.data.links)[1] : '',
                torob: ssdData.data.links ? JSON.parse(ssdData.data.links)[0] : '',
                price: ssdData.data.price ? ssdData.data.price : '',
            })
        }


    }, [isSuccessSsd])


    const dispatch = useDispatch()
    const form = useForm({
        initialValues: {
            name: '',
            size: '',
            read: '',
            write: '',
            age: '',
            brand: '',
            form: '',
            emalls: '',
            torob: '',
            price: '',
        },

        validate: {
            brand: isNotEmpty(),
            name: isNotEmpty(),
        },
    });


    const submitHandleForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        updateSsd({
            id: router.id,
            name: form.values.name,
            size: form.values.size,
            read: form.values.read,
            write: form.values.write,
            age: form.values.age,
            form: form.values.form,
            brand: form.values.brand,
            price: form.values.price,
            links: JSON.stringify([form.values.torob, form.values.emalls])
        })
            .unwrap()
            .then((val) => {
                dispatch(currentSsdOnSave({ id: val.data.id, name: val.data.name }))
                form.onReset
                notifications.show({
                    color: 'green',
                    title: 'ssd با موفقیت ویرایش شد',
                    message: '',
                    classNames: notifCalsses
                })
                props.setActiveStep('step-2')
                props.setActive(1)
            })
        if (response.isError) {
            notifications.show({
                color: 'red',
                title: 'خطای سرور!',
                message: '',
                classNames: notifCalsses
            })
        }
    }

    return (
        <Stack>
            <Text my={"lg"} fz={"lg"} fw={'bolder'}>ویرایش ssd</Text>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="نام"
                            placeholder=" "
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="قیمت"
                            placeholder=""
                            {...form.getInputProps('price')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            label="برند"
                            placeholder=""
                            {...form.getInputProps('brand')}
                            data={['KINGSTON', 'Crucial', 'Samsung', 'MSI']}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="سرعت خواندن"
                            placeholder=" "
                            {...form.getInputProps('read')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="سرعت نوشتن"
                            placeholder=" "
                            {...form.getInputProps('write')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="طول عمر"
                            placeholder=" "
                            {...form.getInputProps('age')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12 }}>
                        <Radio.Group
                            name="favoriteFramework"
                            label="M.2 یا 2.5-inch"
                            {...form.getInputProps('form')}
                        >
                            <Flex mt={'sm'}>
                                <Radio ml={'md'} value="M.2" label="M.2" />
                                <Radio value="2.5-inch" label="2.5-inch" />
                            </Flex>
                        </Radio.Group>
                    </Grid.Col>


                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="لینک ترب"
                            placeholder=""
                            {...form.getInputProps('torob')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="لینک ایمالز"
                            placeholder=""
                            {...form.getInputProps('emalls')}
                        />
                    </Grid.Col>
                </Grid>

                <Group justify="flex-end" mt="md">
                    <Button disabled={!form.isValid()} onClick={(event) => submitHandleForm(event)}
                        type="submit">ویرایش</Button>
                </Group>
            </form>
        </Stack>
    );
};

export default Step1Form;
