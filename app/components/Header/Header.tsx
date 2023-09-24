"use client"
import { Container, Group, Burger, ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });


    return (
        <header className={classes.header}>
            <Container size="lg" className={classes.inner}>
                mr-system
                <Group gap={5} visibleFrom="xs">
                    <Group justify="center">
                        <ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="subtle"
                            size="xl"
                            aria-label="Toggle color scheme"
                        >
                            {computedColorScheme === 'dark' ? <IconSun /> : <IconMoon />}
                        </ActionIcon>
                    </Group>
                </Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            </Container>
        </header>
    );
}



