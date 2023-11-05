"use client"
import React, {useEffect, useState} from 'react';
import {Container, Flex, Group, Skeleton, Space} from "@mantine/core";
import usePiecePc from "../../../utils/customHook/usePiecePc";
import useLoading from "../../../utils/customHook/useLoading";
import { useAuth } from '../../../utils/customHook/useAuth';

type SlugType = 'motherboard' | 'cpu' | 'graphic'

interface Props {
    params: {
        slug: SlugType[]
    };
    searchParams: Record<string, unknown>;
}

const Page: React.FC<Props> = ({params}) => {
    useAuth();

    const firstPiece = usePiecePc(params.slug[0])
    const secondPiece = usePiecePc(params.slug[1])
    console.log(firstPiece, 'firstPiece')
    const loadingEnd  = useLoading()
    return (
            <Container size={'md'}>
                <Group mt={'100px'} justify={'space-between'} align={'center'}>
                    {!loadingEnd &&
                        (
                            <>
                                <Skeleton radius={'xl'} width={400} height={300} mb="xl" />
                                <Skeleton radius={'xl'} height={300} width={400} mb="xl" />
                            </>
                        )
                    }

                    {firstPiece}
                    {secondPiece}
                </Group>
                <Space h="xl"/>
                <Space h="xl"/>
            </Container>
    );
};

export default Page;
