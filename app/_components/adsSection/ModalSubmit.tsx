import { Alert, Box, Button, Flex, Modal, Text, ThemeIcon } from '@mantine/core'
import { IconCircleCheckFilled } from '@tabler/icons-react'
import React, { FC } from 'react'
import SVG from "react-inlinesvg"
import classess from './ads.module.css'

type Props = {
    opened: boolean
    close: () => void
}

const ModalSubmit: FC<Props> = ({ opened, close }) => {
    return (
        <div>
            <Modal 
              styles={{ body: { padding: '0' } }} transitionProps={{ transition: 'pop' }} size={'lg'}  opened={opened} onClose={close} title={<Text fz={'xl'}>آگهی در صف تایید</Text>}>
                <Flex pt={'30px'} align={'center'} direction={'column'} justify={'center'}>

                    <SVG
                        className={classess.successSvg}
                        loader={<Box component='div'></Box>}
                        src='/svg/success.svg' />
                    <Flex wrap={'wrap'} pb={'lg'} mt={'xl'} align={'center'} justify={'center'}>
                        <Text ta={'center'}>آگهی شما با موفقیت ثبت شد و به زودی در سایت منتشر خواهد شد.</Text>
                        <ThemeIcon size={'30px'} variant='transparent' color="teal">
                            <IconCircleCheckFilled size={30} />
                        </ThemeIcon>
                    </Flex>
                    <Flex>
                        <Button gradient={{ from: 'teal', to: 'green', deg: 90 }} mb={'lg'} radius={'xl'} size='md' variant='gradient'>مشاهده لیست آگهی‌های من</Button>
                    </Flex>
                </Flex>

            </Modal>


        </div>
    )
}

export default ModalSubmit