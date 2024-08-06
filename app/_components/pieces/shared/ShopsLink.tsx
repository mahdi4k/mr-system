import { Flex, Button, ActionIcon } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import Image from "next/image";
import { CPU } from '@/_redux/services/cpuApi';
import { Graphic } from '@/_redux/services/graphicApi';
import { POWER } from '@/_redux/services/powerApi';
import { Motherboard } from '@/_redux/services/motherboardApi';

const ShopsLink = ({ currentPiece, justIcon }: { currentPiece: Partial<Motherboard> | Partial<CPU> | Partial<Graphic> | Partial<POWER>, justIcon?: boolean }) => {
    return (
        <Flex justify={justIcon ? 'center' : 'start'} mt={'xs'}>
            {currentPiece.links && (
                <Link href={JSON.parse(currentPiece.links)[0]} target='_blank'>
                    {justIcon ?
                        (<ActionIcon onClick={(event) => event.stopPropagation()} title='لینک ترب' ml={'sm'} variant='light'>
                            <Image alt='' width={20} height={20} src={'/torob.png'} />
                        </ActionIcon>)

                        :
                        (
                            <Button ml={'xs'} px={'xs'} color='red'
                                leftSection={<Image style={{ borderRadius: '100%' }}
                                    alt='torob-kiwi-part' width={20} height={20}
                                    src={'/torob.png'} />}
                                variant='light' >مشاهده در ترب</Button>
                        )}
                </Link>
            )
            }

            {
                (currentPiece.links && JSON.parse(currentPiece.links)[1]) && (
                    <Link href={JSON.parse(currentPiece.links)[1]} target='_blank'>
                        {justIcon ? (
                            (<ActionIcon onClick={(event) => event.stopPropagation()} title='لینک ایمالز' variant='light'>
                                <Image alt='' width={20} height={20} src={'/emalls.png'} />
                            </ActionIcon>)
                        ) : (
                            <Button color="indigo" px={'xs'}
                                variant='light'
                                leftSection={<Image style={{ borderRadius: '100%' }}
                                    alt='emalls-kiwi-part' width={20} height={20} src={'/emalls.png'} />} >مشاهده در ایمالز</Button>
                        )}

                    </Link>
                )
            }
        </Flex >
    )
}

export default ShopsLink