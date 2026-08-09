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
import NextTopLoader from "nextjs-toploader";
import "./global.css";
import { Notifications } from "@mantine/notifications";
import { getCurrentUser } from "./_lib/supabase/auth";

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
  title: "ریگورا",
  description: "Rigora PC hardware platform",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      style={{ height: "100%" }}
      dir="rtl"
      lang="fa"
      className={iranyekan.variable}
      suppressHydrationWarning
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
              <Notifications />
              <Header isAuthenticated={Boolean(user)} />
              {children}
              {modal}
              <Footer />
            </ReduxProviders>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
