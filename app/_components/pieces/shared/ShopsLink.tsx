import { Flex, Button } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import Image from "next/image";
import Motherboard from '../Motherboard';
import { CPU } from '@/_redux/services/cpuApi';
import { Graphic } from '@/_redux/services/graphicApi';
import { POWER } from '@/_redux/services/powerApi';

const ShopsLink = ({ currentPiece }: { currentPiece: Partial<Motherboard> | Partial<CPU> | Partial<Graphic> | Partial<POWER> }) => {
    return (
        <Flex justify={'start'} mt={'xs'}>
            {currentPiece.links && (
                <Link href={JSON.parse(currentPiece.links)[0]} target='_blank'>
                    <Button ml={'xs'} px={'xs'} color='red'
                        leftSection={<Image style={{ borderRadius: '100%' }}
                            alt='torob-kiwi-part' width={20} height={20}
                            src={'/torob.png'} />}
                        variant='light' >مشاهده در ترب</Button>
                </Link>
            )}

            {(currentPiece.links && JSON.parse(currentPiece.links)[1]) && (
                <Link href={JSON.parse(currentPiece.links)[1]} target='_blank'>
                    <Button color="indigo" px={'xs'}
                        variant='light'
                        leftSection={<Image style={{ borderRadius: '100%' }}
                            alt='emalls-kiwi-part' width={20} height={20} src={'/emalls.png'} />} >مشاهده در ایمالز</Button>
                </Link>
            )}
        </Flex>
    )
}

export default ShopsLink