"use client"
import React, { useEffect, useState } from 'react'
import {
    Text, Table, Stack, Flex, Button, ActionIcon, rem, Modal, Alert
} from '@mantine/core';
import { useSession } from "next-auth/react";
import Link from 'next/link'
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import Image from 'next/image';
import { useGetFansQuery, useRemoveFanMutation } from '@/_redux/services/fanApi';


const ClientFan = () => {
    const [loadingSession, setLoadingSession] = useState(false)
    const session = useSession()
    const { isSuccess, data = [], error } = useGetFansQuery({}, { skip: !loadingSession })
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedFanID, setSelectedFanID] = useState<number>()
    const [removeFan, response] = useRemoveFanMutation();

    useEffect(() => {
        setLoadingSession(!!session.data)
    }, [session.data])
    const openModalRemove = (id: number) => {
        setSelectedFanID(id)
        open()
    }
    const handleRemoveFan = () => {
        removeFan(selectedFanID)
        if (isSuccess) {
            notifications.show({
                color: 'green',
                title: 'با موفقیت حذف شد',
                message: '',
                classNames: notifClasses
            })
            close()
        }
    }

    const rows = data?.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>
                <Flex align={'end'}>
                    {element.image && <Image alt={element.name} width={30} height={30} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${element.image}`} />}
                    <Text fz={'sm'} mr={'xs'}>{element.name}</Text>
                </Flex>
            </Table.Td>
            <Table.Td>{element.brand}</Table.Td>
            <Table.Td>{element.rgb ? 'دارد' : 'ندارد'} </Table.Td>
            <Table.Td>{element.fan_noise}</Table.Td>
            <Table.Td>
                <ActionIcon.Group>
                    <ActionIcon onClick={() => openModalRemove(element.id)} ml={"sm"} variant="light" size="md"
                        aria-label="remove">
                        <IconTrash style={{ width: rem(20) }} stroke={1.5} />
                    </ActionIcon>

                    <ActionIcon variant="light" size="md" aria-label="edit">
                        <IconEdit style={{ width: rem(20) }} stroke={1.5} />
                    </ActionIcon>
                </ActionIcon.Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Stack>
                <Flex justify={'space-between'} align={'center'}>
                    <Text mt={"sm"} mb={"md"} fw={"bold"} fz={"lg"}>لیست fan</Text>
                    <Link href="/dashboard/fan/add">
                        <Button variant={'outline'}>افزودن</Button>
                    </Link>
                </Flex>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>نام</Table.Th>
                            <Table.Th>برند</Table.Th>
                            <Table.Th>rgb</Table.Th>
                            <Table.Th>نویز</Table.Th>
                            <Table.Th></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Stack>
            <Modal opened={opened} onClose={close}>
                <Alert variant="light" color="red" title="آیا از حذف این fan مطمئن هستید" />
                <Flex mt={'lg'} justify={'flex-end'}>
                    <Button ml={'md'} variant={'light'} onClick={close}>خیر</Button>
                    <Button bg={'tomato'} color={'white'} variant={'light'}
                        onClick={handleRemoveFan}>بله</Button>
                </Flex>
            </Modal>
        </>
    )
}

export default ClientFan
