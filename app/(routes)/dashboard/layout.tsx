'use client';
import {ActionIcon, AppShell, Burger, Container, Group, Paper, Text} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import Navbar from './(navbar)/Navbar';
import {signOut, useSession} from "next-auth/react";
import {IconLogout2} from '@tabler/icons-react';
import {useDispatch} from "react-redux";
import {addToken} from "../../_redux/features/auth";
import {useEffect} from "react";

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({children}: Props) {

    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
    const [desktopOpened, {toggle: toggleDesktop}] = useDisclosure(true);
    const dispatch = useDispatch()
    const {data} = useSession()
    dispatch(addToken(data))
    useEffect(() => {
        if (data) {
            dispatch(addToken(data.user))
        }
    }, [data, dispatch])

    const logout = () => {
        signOut()
    }

    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {mobile: !mobileOpened, desktop: !desktopOpened},
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group align='center' h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm"/>
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm"/>
                    <Text fw={'bolder'} mt={'4px'}> پنل مدیریت</Text>
                    <ActionIcon onClick={logout} mr={'auto'} variant='default'><IconLogout2/></ActionIcon>
                </Group>

            </AppShell.Header>
            <AppShell.Navbar>
                <Navbar/>

            </AppShell.Navbar>
            <AppShell.Main>
                <Paper>
                    <Container size={'xl'}>
                        <Paper my={'lg'} shadow={'md'} p={'lg'}>
                            {children}
                        </Paper>
                    </Container>
                </Paper>
            </AppShell.Main>
        </AppShell>
    );
}
