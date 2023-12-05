"use client"
import React, {} from 'react';
import {Container, Group, Skeleton} from "@mantine/core";
import useLoading from "@/_utils/customHook/useLoading";
import { useAuth } from '@/_utils/customHook/useAuth';
import usePiecePc from '@/_utils/customHook/usePiecePc';
import { PiecesProps } from './page';
import classes from '@/_components/pieces/pieces.module.css'
const PageClient: React.FC<PiecesProps> = ({params}) => {
    useAuth();

    const firstPiece = usePiecePc(params.slug[0])
    const secondPiece = usePiecePc(params.slug[1])
    const loadingEnd  = useLoading()
    return (
            <Container className={classes.piecesSection} styles={{ root: { flex: '1 0 auto' } }} size={'xl'}>
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
            </Container>
    );
};

export default PageClient;
