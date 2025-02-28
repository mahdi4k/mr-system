import { Card, CopyButton, Tooltip, ActionIcon, rem, Stack, Text, Box, Flex, Skeleton } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import React from 'react';
import { TelegramShareButton, TelegramIcon } from 'react-share';
import { useSearchParams } from 'next/navigation'
import { Motherboard, CPU, Graphic, POWER, RAM, FAN, SSD, CASE, IResult } from '@/_redux/services';


interface CopyPartListProps {
    isSuccessMotherboardData: boolean;
    isSuccessCpu: boolean;
    isSuccessGraphic: boolean;
    isSuccessPower: boolean;
    isSuccessRam: boolean;
    isSuccessFan: boolean;
    isSuccessSsd: boolean;
    isSuccessCase: boolean;
    motherboardData: IResult<Motherboard> | undefined;
    cpuData: IResult<CPU> | undefined;
    graphicData: IResult<Graphic> | undefined;
    powerData: IResult<POWER> | undefined;
    ramData: IResult<RAM> | undefined;
    fanData: IResult<FAN> | undefined;
    ssdData: IResult<SSD> | undefined;
    caseData: IResult<CASE> | undefined;
    totalPrice: string;
}

const CopyPartList: React.FC<CopyPartListProps> = ({
    isSuccessMotherboardData,
    isSuccessCpu,
    isSuccessGraphic,
    isSuccessPower,
    isSuccessRam,
    isSuccessFan,
    isSuccessSsd,
    isSuccessCase,
    motherboardData,
    cpuData,
    graphicData,
    powerData,
    ramData,
    fanData,
    ssdData,
    caseData,
    totalPrice
}) => {
    const removePersianWords = (input: string) => {
        const persianRegex = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]+/g;
        return input.replace(persianRegex, '');
    };
    const searchParams = useSearchParams();


    const cpuParam = searchParams.get('cpu');
    const motherboardParam = searchParams.get('motherboard');
    const ramParam = searchParams.get('ram');
    const graphicParam = searchParams.get('graphic');
    const powerParam = searchParams.get('power');
    const ssdParam = searchParams.get('ssd');
    const fanParam = searchParams.get('fan');
    const caseParam = searchParams.get('case');


    const hasParts = searchParams.has('motherboard') ||
        searchParams.has('cpu') || searchParams.has('graphic') || searchParams.has('power') || searchParams.has('ram') ||
        searchParams.has('fan') || searchParams.has('ssd') || searchParams.has('case');



    const generateTitle = () => {
        let title = "\n";

        const addItemToTitle = (isSuccess: boolean, paramKey: string, data?: { name: string; price?: string }) => {
            if (isSuccess && searchParams.has(paramKey) && data) {
                const itemName = removePersianWords(data.name);
                const itemPrice = data.price ? ` ||  ${Intl.NumberFormat('fa', {}).format(Number(data.price))} تومان` : '';
                title += `${itemName}${itemPrice}\n\n`;
            }
        };

        addItemToTitle(isSuccessMotherboardData, 'motherboard', motherboardData?.data);
        addItemToTitle(isSuccessCpu, 'cpu', cpuData?.data);
        addItemToTitle(isSuccessGraphic, 'graphic', graphicData?.data);
        addItemToTitle(isSuccessPower, 'power', powerData?.data);
        addItemToTitle(isSuccessRam, 'ram', ramData?.data);
        addItemToTitle(isSuccessFan, 'fan', fanData?.data);
        addItemToTitle(isSuccessSsd, 'ssd', ssdData?.data);
        addItemToTitle(isSuccessCase, 'case', caseData?.data);

        if (Number(totalPrice) > 0) {
            title += `\n مجموع: ${Intl.NumberFormat('fa', {}).format(Number(totalPrice))} تومان`;
        }

        return title;
    };
    return (
        <div>
            {(hasParts) && (
                <Card maw={'380px'} bg={'var(--mantine-color-body)'} mt={'lg'} shadow='sm' radius={'md'}>
                    <Flex justify={'flex-end'} align={'center'}>
                        <CopyButton value={`${typeof window !== 'undefined' ? window.location.href : ''}\n\n${generateTitle()}`} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'کپی شد' : 'کپی'} withArrow position="top">
                                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                        {copied ? (
                                            <IconCheck style={{ width: rem(16) }} />
                                        ) : (
                                            <IconCopy style={{ width: rem(16) }} />
                                        )}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                        <Box mr={'sm'}>
                            <TelegramShareButton style={{ display: 'flex' }}
                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                title={generateTitle()}
                            >
                                <TelegramIcon size={18} round />
                            </TelegramShareButton>
                        </Box>
                    </Flex>
                    <Stack mt={'sm'} gap={'sm'}>
                        {isSuccessMotherboardData && motherboardParam ? (
                            <Flex
                                hidden={!searchParams.has('motherboard')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{motherboardData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(motherboardData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fw={'bold'} fz={'xs'}>{removePersianWords(motherboardData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessCpu && cpuParam ? (
                            <Flex
                                hidden={!searchParams.has('cpu')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{cpuData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(cpuData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fw={'bold'} fz={'xs'}>{removePersianWords(cpuData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessGraphic && graphicParam ? (
                            <Flex
                                hidden={!searchParams.has('graphic')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{graphicData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(graphicData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fw={'bold'} fz={'xs'}>{removePersianWords(graphicData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessPower && powerParam ? (
                            <Flex
                                hidden={!searchParams.has('power')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{powerData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(powerData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fz={'xs'} fw={'bold'}>{removePersianWords(powerData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessRam && ramParam ? (
                            <Flex
                                hidden={!searchParams.has('ram')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{ramData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(ramData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fz={'xs'} fw={'bold'}>{removePersianWords(ramData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessFan && fanParam ? (
                            <Flex
                                hidden={!searchParams.has('fan')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{fanData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(fanData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" hidden={!searchParams.has('fan')} fz={'xs'} fw={'bold'}>{removePersianWords(fanData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessSsd && ssdParam ? (
                            <Flex
                                hidden={!searchParams.has('ssd')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{ssdData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(ssdData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fz={'xs'} fw={'bold'}>{removePersianWords(ssdData?.data.name as string)}</Text>
                                </Box>
                            </Flex>
                        ) : ''}
                        {isSuccessCase && caseParam ? (
                            <Flex
                                hidden={!searchParams.has('case')}
                                justify="space-between"
                                align="center"
                                fz="sm"
                                fw="bold"
                            >
                                <Text fw={'bold'} fz={'xs'}>{caseData?.data.price ? `${Intl.NumberFormat('fa', {}).format(Number(caseData.data.price))} تومان` : ''}</Text>
                                <Box w={215}>
                                    <Text truncate="start" fz={'xs'} fw={'bold'}>{removePersianWords(caseData?.data.name as string)}</Text>
                                </Box>
                            </Flex>) : ''}
                    </Stack>
                </Card>
            )}
        </div>
    );
};

export default CopyPartList;
