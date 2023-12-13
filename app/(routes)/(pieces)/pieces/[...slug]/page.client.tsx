"use client"
import React, { useEffect, useState } from 'react';
import {Container, Group, Skeleton} from "@mantine/core";
import useLoading from "@/_utils/customHook/useLoading";
import { useAuth } from '@/_utils/customHook/useAuth';
import usePiecePc from '@/_utils/customHook/usePiecePc';
import { PiecesProps } from './page';
import classes from '@/_components/pieces/pieces.module.css'
import { IconCircleDotFilled } from '@tabler/icons-react';
import { ObjectIsEmpty } from '@/_utils/utils';
const PageClient: React.FC<PiecesProps> = ({params}) => {
    
    useAuth();  
  
    const firstPiece = usePiecePc(params.slug[0])
    const secondPiece = usePiecePc(params.slug[1])
    const loadingEnd  = useLoading();
    const [isPartSelected,setIsPartSelected] = useState<boolean>(false)
 
      useEffect(()=>{
        setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeMotherboard))
      },[secondPiece.props,firstPiece.props])
      
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
                     <IconCircleDotFilled size={'40px'} className={`${classes.blob} ${loadingEnd ? classes.showBlob : ''} ${isPartSelected ? classes.activeBlob : ''} `}/>
                    {secondPiece}
                </Group>
            </Container>
    );
};

export default PageClient;
