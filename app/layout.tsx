import "@mantine/core/styles.css";
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  DirectionProvider,
} from "@mantine/core";
import { theme } from "../theme";
import localFont from "next/font/local";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import { ReduxProviders } from "@/_redux/provider";
import { Header } from "@/_components/Header/Header";
import { Footer } from "@/_components/Footer/Footer";
import Providers from "./(routes)/dashboard/Provider";
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { cookies } from "next/headers";

const iranyekan = localFont({
  src: [
    {
      path: "../public/fonts/IRANYekanXVFaNumVF.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/IRANYekanXVFaNumVF.woff",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata = {
  title: "کیوی پارت",
  description: "kiwi-part pc building",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: any;
  modal: any;
}) {
  const token = cookies().get("authToken")?.value;

  return (
    <html
      style={{ height: "100%" }}
      dir="rtl"
      lang="en"
      className={iranyekan.variable}
    >
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ height: "100%" }}>
        <NextTopLoader showSpinner={false} height={5} color="#87A10C" />

        <DirectionProvider>
          <MantineProvider theme={theme}>
            <ReduxProviders>
              <Providers>
                <Header token={token} />
                {children}
                {modal}

                <Footer />
              </Providers>
            </ReduxProviders>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
