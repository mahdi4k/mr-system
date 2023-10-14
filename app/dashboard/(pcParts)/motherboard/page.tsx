"use client"
import React, {useEffect, useState} from 'react'
import {
    Text, Table, Stack, Flex, Button
} from '@mantine/core';
import {useGetMotherboardsQuery} from "../../../redux/services/motherboardApi";
import {useSession} from "next-auth/react";
import Link from 'next/link'


const Motherboard = () => {
    const [loadingSession, setLoadingSession] = useState(false)
    const session = useSession()
    const {isLoading, isSuccess, data = [], error} = useGetMotherboardsQuery(undefined, {skip: !loadingSession})


    useEffect(() => {
        setLoadingSession(!!session.data)
    }, [session.data])

    const rows = data?.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.brand}</Table.Td>
            <Table.Td>{element.total_slot_ram}</Table.Td>
            <Table.Td>{element.size}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Flex justify={'space-between'} align={'center'}>
                <Text mt={"sm"} mb={"md"} fw={"bold"} fz={"lg"}>لیست مادبرد</Text>
                <Link href="/dashboard/motherboard/add">
                    <Button variant={'outline'}>افزودن</Button>
                </Link>
            </Flex>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>عنوان</Table.Th>
                        <Table.Th>برند</Table.Th>
                        <Table.Th>تعداد اسلات رم</Table.Th>
                        <Table.Th>سایز</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Stack>
    )
}

export default Motherboard
