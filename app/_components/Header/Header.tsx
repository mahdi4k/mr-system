"use client"
import {Container, Group, Burger, ActionIcon, useComputedColorScheme, useMantineColorScheme} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import classes from './Header.module.css';
import {IconSun, IconMoon} from '@tabler/icons-react';
import Link from "next/link";
import UseLoading from "@/_utils/customHook/useLoading";
import Image from 'next/image'

export function Header() {
    const [opened, {toggle}] = useDisclosure(false);
    const {setColorScheme} = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    const isLoading = UseLoading()
    return (

        <header className={classes.header}>
            <Container size="lg" className={classes.inner}>
                <Link style={{height:40}} className={'text-decoration-none'} href={'/'}>
                     <Image style={{objectFit:'contain'}} alt='' src={'/logo.png'} width={80} height={40} />
                </Link>
                <Group gap={5} visibleFrom="xs">
                    <Group justify="center">
                        {isLoading ? (<ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="subtle"
                            size="xl"
                            aria-label="Toggle color scheme"
                            color={'#7ea300'}
                        >
                            {computedColorScheme === 'light' ? <IconMoon/> : <IconSun/>}
                        </ActionIcon>) : ''}
                    </Group>
                </Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>
            </Container>
        </header>
    );
}



