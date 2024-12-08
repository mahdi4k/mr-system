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


    const hasParts = searchParams.has('motherboard') ||
        searchParams.has('cpu') || searchParams.has('graphic') || searchParams.has('power') || searchParams.has('ram') ||
        searchParams.has('fan') || searchParams.has('ssd') || searchParams.has('case');



    const generateTitle = () => {
        let title = "\n";
        if (isSuccessMotherboardData && searchParams.has('motherboard')) title += removePersianWords(motherboardData?.data.name as string) + "\n";
        if (isSuccessCpu && searchParams.has('cpu')) title += removePersianWords(cpuData?.data.name as string) + "\n";
        if (isSuccessGraphic && searchParams.has('graphic')) title += removePersianWords(graphicData?.data.name as string) + "\n";
        if (isSuccessPower && searchParams.has('power')) title += removePersianWords(powerData?.data.name as string) + "\n";
        if (isSuccessRam && searchParams.has('ram')) title += removePersianWords(ramData?.data.name as string) + "\n";
        if (isSuccessFan && searchParams.has('fan')) title += removePersianWords(fanData?.data.name as string) + "\n";
        if (isSuccessSsd && searchParams.has('ssd')) title += removePersianWords(ssdData?.data.name as string) + "\n";
        if (isSuccessCase && searchParams.has('case')) title += removePersianWords(caseData?.data.name as string) + "\n";
        if (Number(totalPrice) > 0) title += ` تومان ${Intl.NumberFormat('fa', {}).format(Number(totalPrice))}`;
        return title  // Remove any trailing newline
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
                            <TelegramShareButton style={{display:'flex'}}
                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                title={generateTitle()}
                            >
                                <TelegramIcon size={18} round />
                            </TelegramShareButton>
                        </Box>
                    </Flex>
                    <Stack gap={'sm'}>
                        {isSuccessMotherboardData ? (
                            <Text hidden={!searchParams.has('motherboard')} fz={'sm'} fw={'bold'}>{removePersianWords(motherboardData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={16} radius="md" />}
                        {isSuccessCpu ? (
                            <Text hidden={!searchParams.has('cpu')} fz={'sm'} fw={'bold'}>{removePersianWords(cpuData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                        {isSuccessGraphic ? (
                            <Text hidden={!searchParams.has('graphic')} fz={'sm'} fw={'bold'}>{removePersianWords(graphicData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                        {isSuccessPower ? (
                            <Text hidden={!searchParams.has('power')} fz={'sm'} fw={'bold'}>{removePersianWords(powerData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                        {isSuccessRam ? (
                            <Text hidden={!searchParams.has('ram')} fz={'sm'} fw={'bold'}>{removePersianWords(ramData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                        {isSuccessFan ? (
                            <Text hidden={!searchParams.has('fan')} fz={'sm'} fw={'bold'}>{removePersianWords(fanData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                        {isSuccessSsd ? (
                            <Text hidden={!searchParams.has('ssd')} fz={'sm'} fw={'bold'}>{removePersianWords(ssdData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                        {isSuccessCase ? (
                            <Text hidden={!searchParams.has('case')} fz={'sm'} fw={'bold'}>{removePersianWords(caseData?.data.name as string)}</Text>
                        ) : <Skeleton height={15} mt={10} radius="md" />}
                    </Stack>
                </Card>
            )}
        </div>
    );
};

export default CopyPartList;
