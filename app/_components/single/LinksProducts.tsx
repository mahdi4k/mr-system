import { Flex, Button } from '@mantine/core'
import Link from 'next/link'
import React, { FC } from 'react'
import Image from 'next/image';

type Props = {
    torobLink: string
    EmallsLink: string
}

const LinksProducts: FC<Props> = ({ torobLink, EmallsLink }) => {
    return (
        <Flex justify={'end'} my={'xl'}>
            {torobLink && (
                <Link href={torobLink} target='_blank'>
                    <Button px={'xs'} color='red'
                        leftSection={<Image style={{ borderRadius: '100%' }}
                            alt='torob-kiwi-part' width={20} height={20}
                            src={'/torob.png'} />}
                        variant='light' >مشاهده در ترب</Button>
                </Link>
            )}

            {EmallsLink && (
                <Link href={EmallsLink} target='_blank'>
                    <Button mr={'lg'} color="indigo" px={'xs'}
                        variant='light'
                        leftSection={<Image style={{ borderRadius: '100%' }}
                            alt='emalls-kiwi-part' width={20} height={20} src={'/emalls.png'} />} >مشاهده در ایمالز</Button>
                </Link>
            )}
        </Flex>
    )
}

export default LinksProducts