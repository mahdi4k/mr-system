import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript, DirectionProvider } from "@mantine/core";
import { theme } from "../theme";
import { Vazirmatn } from 'next/font/google'
import './global.css'
import '@mantine/notifications/styles.css';
import Providers from "./dashboard/Provider";
import {ReduxProviders} from "./redux/provider";

const vazirmatn = Vazirmatn({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export const metadata = {
  title: "mr-system",
  description: "mr-system pc building",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html dir="rtl" lang="en" className={vazirmatn.className}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <DirectionProvider>
          <MantineProvider theme={theme}>
            <ReduxProviders>
            <Providers>
              {children}
            </Providers>
            </ReduxProviders>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
