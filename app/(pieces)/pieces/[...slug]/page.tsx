"use client"
import React from 'react';
import {Container, Flex, Group} from "@mantine/core";
import useFirstPiecePc from "../../../utils/customHook/useFirstPiecePc";

type SlugType = 'motherboard' | 'cpu' | 'graphic'

interface Props {
    params: {
        slug: SlugType[]
    };
    searchParams: Record<string, unknown>;
}

const Page: React.FC<Props> = ({params}) => {

    const firstPiece = useFirstPiecePc(params.slug[0])
    const secondPiece = useFirstPiecePc(params.slug[1])
    console.log(firstPiece, 'firstPiece')
    return (
        <Container size={'md'}>
            <Group mt={'100px'} justify={'space-between'} align={'center'}>
                {firstPiece}
                {secondPiece}
            </Group>
        </Container>
    );
};

export default Page;
