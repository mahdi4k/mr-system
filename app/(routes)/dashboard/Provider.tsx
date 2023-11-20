"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Notifications } from '@mantine/notifications';

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
    return <SessionProvider refetchInterval={24 * 60 * 60} refetchOnWindowFocus={false}  >
        <Notifications />
        {children}
    </SessionProvider>;
};

export default Providers;
