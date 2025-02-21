"use client"
import { Container, Text, Group, Burger, ActionIcon, useComputedColorScheme, useMantineColorScheme, Box, Center, HoverCard, SimpleGrid, UnstyledButton, rem, ThemeIcon, Flex, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { IconSun, IconMoon, IconChevronDown, IconChartPie3, IconUserCircle, IconBrandLine } from '@tabler/icons-react';
import Link from "next/link";
import UseLoading from "@/_utils/customHook/useLoading";
import Image from 'next/image'
import DrawerHeader from './Drawer';
import LoginModal from '../loginModal/LoginModal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';
import { RootState } from '@/_redux/store';

export function Header({ token }: { token?: string }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
    const { setColorScheme, colorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const isLoading = UseLoading();
    const router = useRouter();
    const success = useSelector((state: RootState) => state.auth.success);
    const [logoSrc, setLogoSrc] = useState<string | null>(null); // Default to null


    useEffect(() => {
        router.prefetch('/profile');
    }, [router]);

    const handleAddAdsPage = () => {

        if (token || success) {
            router.push('/profile', { scroll: true })
        } else {
            openModal()
        }
    }
    useEffect(() => {
        if (colorScheme === 'dark') {
            setLogoSrc('/logo-dark.png');
        } else {
            setLogoSrc('/logo.png');
        }
    }, [colorScheme]);

    // Only render the image once the logo source is set
    if (!logoSrc) {
        return null; // Prevent rendering until logoSrc is determined
    }

    return (

        <header className={`${classes.header} main-header`}>
            <Container size="lg" className={classes.inner}>
                <Burger opened={opened} onClick={open} hiddenFrom="xs" size="sm" />

                <Flex className={classes.mobileHeader} align={'center'}>
                    <Link style={{ height: 40 }} className={'text-decoration-none'} href={'/'}>
                        <Image style={{ objectFit: 'contain' }} alt='kiwi part' src={logoSrc} width={80} height={40} />
                    </Link>


                    <Group mr={'xl'} h="100%" gap={0} visibleFrom="sm">
                        <HoverCard width={750} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>
                                            قطعات
                                        </Box>
                                        <IconChevronDown
                                            style={{ width: rem(16), height: rem(16) }}

                                        />
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <SimpleGrid cols={4} spacing={0}>
                                    <Link href='/category/motherboard'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={20} src={'/svg/motherboard.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    مادربرد
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>
                                    <Link href='/category/graphic'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={20} src={'/svg/graphic.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    کارت گرافیک
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>
                                    <Link href='/category/power'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={30} src={'/svg/power.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    پاور
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>

                                    <Link href='/category/cpu'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={20} src={'/svg/cpu.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    cpu
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>
                                    <Link href='/category/case'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={25} height={25} src={'/svg/case.svg'} alt={'case'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    قاب کیس
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>
                                    <Link href='/category/ssd'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={25} height={25} src={'/svg/ssd.svg'} alt={'ssd'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    ssd
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>
                                    <Link href='/category/ram'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={25} height={25} src={'/svg/ram.svg'} alt={'ram'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    رم
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>
                                    <Link href='/category/fan'>
                                        <UnstyledButton p={'lg'} className={classes.subLink} >
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={35} height={35} src={'/svg/fan.svg'} alt={'fan'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    فن
                                                </Text>
                                            </Group>
                                        </UnstyledButton>
                                    </Link>


                                </SimpleGrid>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>
                </Flex>


                <Group gap={5} >
                    <ActionIcon component={Link} href={'/chat'} onClick={handleAddAdsPage} size={'lg'} radius={'lg'} variant='transparent' ml={'md'}>
                        <IconBrandLine size={24} />
                    </ActionIcon>

                    <Group w={'27px'} justify="center">
                        {isLoading ? (<ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="subtle"
                            size="xl"
                            aria-label="Toggle color scheme"
                            color={'#7ea300'}
                        >
                            {computedColorScheme === 'light' ? <IconMoon /> : <IconSun />}
                        </ActionIcon>) : ''}
                    </Group>
                    <ActionIcon onClick={handleAddAdsPage} size={'lg'} radius={'lg'} variant='light' mr={'lg'}>
                        <IconUserCircle size={24} />
                    </ActionIcon>
                </Group>
            </Container>
            <DrawerHeader opened={opened} close={close} />

            <Modal opened={openedModal} onClose={closeModal} title="ورود / ثبت نام" >
                <LoginModal close={closeModal} />
            </Modal>

        </header>
    );
}



