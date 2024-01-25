"use client"
import { Container, Text, Group, Burger, ActionIcon, useComputedColorScheme, useMantineColorScheme, Box, Center, HoverCard, SimpleGrid, UnstyledButton, rem, ThemeIcon, useMantineTheme, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { IconSun, IconMoon, IconChevronDown, IconChartPie3 } from '@tabler/icons-react';
import Link from "next/link";
import UseLoading from "@/_utils/customHook/useLoading";
import Image from 'next/image'

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const isLoading = UseLoading();

    return (

        <header className={`${classes.header} main-header`}>
            <Container size="lg" className={classes.inner}>
                <Flex align={'center'}>
                    <Link style={{ height: 40 }} className={'text-decoration-none'} href={'/'}>
                        <Image style={{ objectFit: 'contain' }} alt='kiwi part' src={'/logo.png'} width={80} height={40} />
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
                                            color={'blue'}
                                        />
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <SimpleGrid cols={3} spacing={0}>
                                    <UnstyledButton p={'lg'} className={classes.subLink}>
                                        <Group wrap="nowrap" align="center">
                                            <ThemeIcon size={34} variant="default" radius="md">
                                                <Image width={20} height={20} src={'/svg/cpu.svg'} alt={'cpu'} />
                                            </ThemeIcon>
                                            <Text size="sm" fw={500}>
                                                cpu
                                            </Text>
                                        </Group>
                                    </UnstyledButton>
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Group wrap="nowrap" align="center">
                                            <ThemeIcon size={34} variant="default" radius="md">
                                                <Image width={20} height={20} src={'/svg/motherboard.svg'} alt={'cpu'} />
                                            </ThemeIcon>
                                            <Text size="sm" fw={500}>
                                                مادربورد
                                            </Text>
                                        </Group>
                                    </UnstyledButton>
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
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Group wrap="nowrap" align="center">
                                            <ThemeIcon size={34} variant="default" radius="md">
                                                <IconChartPie3 style={{ width: rem(22), height: rem(22) }} color={'blue'} />
                                            </ThemeIcon>
                                            <Text size="sm" fw={500}>
                                                پاور
                                            </Text>
                                        </Group>
                                    </UnstyledButton>
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Group wrap="nowrap" align="center">
                                            <ThemeIcon size={34} variant="default" radius="md">
                                                <IconChartPie3 style={{ width: rem(22), height: rem(22) }} color={'blue'} />
                                            </ThemeIcon>
                                            <Text size="sm" fw={500}>
                                                قاب کیس
                                            </Text>
                                        </Group>
                                    </UnstyledButton>
                                    <UnstyledButton p={'lg'} className={classes.subLink} >
                                        <Group wrap="nowrap" align="center">
                                            <ThemeIcon size={34} variant="default" radius="md">
                                                <IconChartPie3 style={{ width: rem(22), height: rem(22) }} color={'blue'} />
                                            </ThemeIcon>
                                            <Text size="sm" fw={500}>
                                                رم
                                            </Text>
                                        </Group>
                                    </UnstyledButton>
                                </SimpleGrid>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </Group>
                </Flex>


                <Group gap={5} visibleFrom="xs">
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
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            </Container>
        </header>
    );
}



