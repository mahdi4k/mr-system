"use client"

import { Container, Grid, Card, NavLink } from '@mantine/core';
import { IconUser, IconHome2 } from '@tabler/icons-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ProfileLayoutProps {
    children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    return (
        <Container mt="lg" styles={{ root: { flex: '1 0 auto', width: '100%' } }} size="lg">
            <Grid mt="xl">
                <Grid.Col span={{base:12,lg:3}}>
                    <Card withBorder>
                        <NavLink active={isActive('/profile')} component={Link} href="/profile" label="پروفایل" leftSection={<IconUser size="1rem" stroke={1.5} />} />
                        <NavLink active={isActive('/profile/ads')} component={Link} href="/profile/ads" label="آگهی‌های من" leftSection={<IconHome2 size="1rem" stroke={1.5} />} />
                    </Card>
                </Grid.Col>
                <Grid.Col span={{base:12,lg:9}}>{children}</Grid.Col>
            </Grid>
        </Container>
    );
}
