import "@mantine/core/styles.css";
import React, { Suspense } from "react";
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from "@mantine/core";
import { theme } from "../theme";
import localFont from "next/font/local";
import "@mantine/notifications/styles.css";
import { ReduxProviders } from "@/_redux/provider";
import { Header } from "@/_components/Header/Header";
import { Footer } from "@/_components/Footer/Footer";
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { Notifications } from "@mantine/notifications";
import LoginSuccessNotification from "./_components/auth/LoginSuccessNotification";
import AppChrome from "./_components/shared/AppChrome";

const iranyekan = localFont({
  src: [
    {
      path: "../public/fonts/IRANYekanXVFaNumVF.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "ریگورا",
  description: "Rigora PC hardware platform",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html
      style={{ height: "100%" }}
      dir="rtl"
      lang="fa"
      className={iranyekan.variable}
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ height: "100%" }}>
        <NextTopLoader showSpinner={false} height={5} color="#87A10C" />

        <DirectionProvider>
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            <ReduxProviders>
              <Notifications />
              <Suspense fallback={null}>
                <LoginSuccessNotification />
              </Suspense>
              <AppChrome>
                <Header />
              </AppChrome>
              {children}
              {modal}
              <AppChrome>
                <Footer />
              </AppChrome>
            </ReduxProviders>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
