"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Notifications } from '@mantine/notifications';

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
    return <SessionProvider>
        <Notifications />
        {children}
    </SessionProvider>;
};

export default Providers;
