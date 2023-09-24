'use client';
import { AppShell, Burger, Container, Group, Paper, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Navbar from './Navbar';

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    logo
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <Navbar />

            </AppShell.Navbar>
            <AppShell.Main>
                <Paper>
                    <Container fluid >
                        {children}
                    </Container>
                </Paper>
            </AppShell.Main>
        </AppShell>
    );
}