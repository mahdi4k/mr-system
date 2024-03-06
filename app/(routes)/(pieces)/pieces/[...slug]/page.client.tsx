"use client"
import React, { useEffect, useState } from 'react';
import { Container, Group, Paper, Skeleton, Table, Text } from "@mantine/core";
import useLoading from "@/_utils/customHook/useLoading";
import { useAuth } from '@/_utils/customHook/useAuth';
import usePiecePc from '@/_utils/customHook/usePiecePc';
import { PiecesProps } from './page';
import classes from '@/_components/pieces/pieces.module.css'
import { IconCircleDotFilled } from '@tabler/icons-react';
import { ObjectIsEmpty } from '@/_utils/utils';

const PageClient: React.FC<PiecesProps> = ({ params }) => {

    useAuth();

    const firstPiece = usePiecePc(params.slug[0])
    const secondPiece = usePiecePc(params.slug[1])
    const loadingEnd = useLoading();
    const [isPartSelected, setIsPartSelected] = useState<boolean>(false)

    useEffect(() => {        
        
        if(secondPiece.props.activeCpu && firstPiece.props.activeMotherboard){
            setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeMotherboard))

        }
        if(secondPiece.props.activePower && firstPiece.props.activeGraphic){
            setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activePower) && !ObjectIsEmpty(firstPiece.props.activeGraphic))
        }
        if(secondPiece.props.activeCpu && firstPiece.props.activeGraphic){
            setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeGraphic))
        }

    }, [secondPiece.props, firstPiece.props])

    return (
        <Container className={classes.piecesSection} styles={{ root: { flex: '1 0 auto' } }} size={'xl'}>
            <Group mt={'100px'} justify={'space-between'} align={'start'}>
                {!loadingEnd &&
                    (
                        <>
                            <Skeleton radius={'xl'} width={400} height={300} mb="xl" />
                            <Skeleton radius={'xl'} height={300} width={400} mb="xl" />
                        </>
                    )
                }

                {firstPiece}
                <IconCircleDotFilled size={'40px'} className={`${classes.blob} ${loadingEnd ? classes.showBlob : ''} ${isPartSelected ? classes.activeBlob : ''} `} />
                {secondPiece}
            </Group>
            {
                !ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeMotherboard) ? (
                    <Paper shadow="sm" radius={'lg'} mt={'50px'} mb={'100px'} p="xl">
                        <Group justify={'space-between'} align={'start'}>
                            <Text>رم‌های مناسب با قطعات انتخاب شده</Text>
                            <Table striped highlightOnHover withRowBorders={false}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th> </Table.Th>
                                        <Table.Th> </Table.Th>
                                        <Table.Th> </Table.Th>
                                        <Table.Th> </Table.Th>
                                        <Table.Th> </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td>کینگستون</Table.Td>
                                        <Table.Td>8gig</Table.Td>
                                        <Table.Td>ddr4</Table.Td>
                                        <Table.Td>۱۰۰۰۰۰۰ تومان </Table.Td>
                                        <Table.Td>خرید </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td>کینگستون</Table.Td>
                                        <Table.Td>16gig</Table.Td>
                                        <Table.Td>ddr4</Table.Td>
                                        <Table.Td>۱۰۰۰۰۰۰ تومان </Table.Td>
                                        <Table.Td>خرید </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Group>
                    </Paper>
                ) : ''
            }

        </Container>
    );
};

export default PageClient;
