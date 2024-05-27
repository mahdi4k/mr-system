"use client"
import { Container, Text, Group, Burger, ActionIcon, useComputedColorScheme, useMantineColorScheme, Box, Center, HoverCard, SimpleGrid, UnstyledButton, rem, ThemeIcon, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { IconSun, IconMoon, IconChevronDown, IconChartPie3 } from '@tabler/icons-react';
import Link from "next/link";
import UseLoading from "@/_utils/customHook/useLoading";
import Image from 'next/image'
import DrawerHeader from './Drawer';

export function Header() {
    const [opened, { open, close }] = useDisclosure(false);
    const { setColorScheme, colorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const isLoading = UseLoading();

    return (

        <header className={`${classes.header} main-header`}>
            <Container size="lg" className={classes.inner}>
                <Burger opened={opened} onClick={open} hiddenFrom="xs" size="sm" />

                <Flex align={'center'}>
                    <Link style={{ height: 40 }} className={'text-decoration-none'} href={'/'}>
                        <Image style={{ objectFit: 'contain' }} alt='kiwi part' src={colorScheme === 'dark' ? '/logo-dark.png' : '/logo.png'} width={80} height={40} />
                    </Link>


                    <Group mr={'xl'} h="100%" gap={0} visibleFrom="sm">
                        <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
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
                                <SimpleGrid cols={3} spacing={0}>
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
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Link href='/category/graphic'>
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={20} src={'/svg/graphic.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    کارت گرافیک
                                                </Text>
                                            </Group>
                                        </Link>
                                    </UnstyledButton>

                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Link href='/category/power'>
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={30} src={'/svg/power.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    پاور
                                                </Text>
                                            </Group>
                                        </Link>
                                    </UnstyledButton>
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Link href='/category/cpu'>
                                            <Group wrap="nowrap" align="center">
                                                <ThemeIcon size={34} variant="default" radius="md">
                                                    <Image width={20} height={20} src={'/svg/cpu.svg'} alt={'cpu'} />
                                                </ThemeIcon>
                                                <Text size="sm" fw={500}>
                                                    cpu
                                                </Text>
                                            </Group>
                                        </Link>
                                    </UnstyledButton>
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Group wrap="nowrap" align="center">
                                            <ThemeIcon size={34} variant="default" radius="md">
                                                <Image width={25} height={25} src={'/svg/case.svg'} alt={'cpu'} />
                                            </ThemeIcon>
                                            <Text size="sm" fw={500}>
                                                قاب کیس
                                            </Text>
                                        </Group>
                                    </UnstyledButton>

                                </SimpleGrid>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>
                </Flex>


                <Group gap={5} >
                    <Group justify="center">
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
                </Group>
            </Container>
            <DrawerHeader opened={opened} close={close} />
        </header>
    );
}



