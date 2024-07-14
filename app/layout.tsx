import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript, DirectionProvider } from "@mantine/core";
import { theme } from "../theme";
import { Vazirmatn , Vibes} from 'next/font/google'
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import { ReduxProviders } from "@/_redux/provider";
import { Header } from "@/_components/Header/Header";
import { Footer } from "@/_components/Footer/Footer";
import Providers from "./(routes)/dashboard/Provider";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics  } from '@next/third-parties/google'
import './global.css'



const vibes = Vibes({
  weight: ['400'],
  subsets: ['arabic'],
  variable: '--font-vibes',
  display: 'swap',
  adjustFontFallback: false
})


const vazirmatn = Vazirmatn({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
  adjustFontFallback: false
})


export const metadata = {
  title: "کیوی پارت",
  description: "kiwi-part pc building",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html dir="rtl" lang="en" className={`${vazirmatn.variable} ${vibes.variable}`}>
      <GoogleAnalytics gaId="G-0V5T3XRVPY" />
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <NextTopLoader showSpinner={false} height={5} color="#87A10C" />

        <DirectionProvider>
          <MantineProvider theme={theme}>
            <ReduxProviders>
              <Providers>
                <Header />
                {children}
                <Footer />
              </Providers>
            </ReduxProviders>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
