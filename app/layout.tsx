import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import React from "react";
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
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
import LoginSuccessNotification from "./_components/auth/LoginSuccessNotification";
import AppChrome from "./_components/shared/AppChrome";

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
  const userMetadata = user?.user_metadata as
    | { display_name?: string; full_name?: string; name?: string }
    | undefined;
  const userLabel =
    userMetadata?.display_name ||
    userMetadata?.full_name ||
    userMetadata?.name ||
    user?.email?.split("@")[0];

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
              <LoginSuccessNotification />
              <AppChrome>
                <Header isAuthenticated={Boolean(user)} userLabel={userLabel} />
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
