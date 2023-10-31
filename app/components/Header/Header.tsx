"use client"
import {Container, Group, Burger, ActionIcon, useComputedColorScheme, useMantineColorScheme} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import classes from './Header.module.css';
import {IconSun, IconMoon} from '@tabler/icons-react';
import Link from "next/link";
import UseLoading from "../../utils/customHook/useLoading";

export function Header() {
    const [opened, {toggle}] = useDisclosure(false);
    const {setColorScheme} = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    const isLoading = UseLoading()
    return (

        <header className={classes.header}>
            <Container size="lg" className={classes.inner}>
                <Link className={'text-decoration-none'} href={'/'}>
                    mr-system
                </Link>
                <Group gap={5} visibleFrom="xs">
                    <Group justify="center">
                        {isLoading ? (<ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="subtle"
                            size="xl"
                            aria-label="Toggle color scheme"
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



