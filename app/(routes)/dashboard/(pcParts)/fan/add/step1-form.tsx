"use client"

import React from 'react';
import {
    Button,
    Grid,
    Group,
    Select,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import { currentFanOnSave } from "@/_redux/features/fan";
import { useDispatch } from "react-redux";
import { StepProps } from "../../motherboard/add/step1-form";
import { useCreateFanMutation } from '@/_redux/services/fanApi';


const Step1Form = (props: StepProps) => {
    const [createFan, response] = useCreateFanMutation();
    const dispatch = useDispatch()
    const form = useForm({
        initialValues: {
            name: '',
            fan_noise: '',
            brand: '',
            heat_sink_material: '',
            cpu_sockets: '',
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
        createFan({
            name: form.values.name,
            fan_noise: form.values.fan_noise,
            heat_sink_material: form.values.heat_sink_material,
            cpu_sockets: form.values.cpu_sockets,
            brand: form.values.brand,
            price: form.values.price,
            links: JSON.stringify([form.values.torob, form.values.emalls])
        })
            .unwrap()
            .then((val) => {
                dispatch(currentFanOnSave({ id: val.data.id, name: val.data.name }))
                form.onReset
                notifications.show({
                    color: 'green',
                    title: 'fan با موفقیت ثبت شد',
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
            <Text my={"lg"} fz={"lg"} fw={'bolder'}>افزودن پاور</Text>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="نام"
                            placeholder="fan intel"
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
                        <TextInput
                            label="فن نویز"
                            placeholder=""
                            {...form.getInputProps('fan_noise')}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="هیت سینک متریال"
                            placeholder=""
                            {...form.getInputProps('heat_sink_material')}
                        />
                    </Grid.Col>


                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            label="برند"
                            placeholder=""
                            {...form.getInputProps('brand')}
                            data={['intel', 'Cooler Master','DEEPCOOL']}
                        />
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
                        type="submit">ثبت</Button>
                </Group>
            </form>
        </Stack>
    );
};

export default Step1Form;
