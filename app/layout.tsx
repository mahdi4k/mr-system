import type { Metadata } from "next";
import { getSiteUrl } from "./_utils/siteUrl";
import "@mantine/core/styles.css";
import React, { Suspense } from "react";
import { DirectionProvider, MantineProvider } from "@mantine/core";
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

export const metadata: Metadata = {
  title: {
    default: "ریگورا | اسمبل آنلاین سیستم و بازارچه قطعات کامپیوتر",
    template: "%s | ریگورا",
  },
  description:
    "ریگورا؛ ابزار اسمبل آنلاین سیستم گیمینگ و بازارچه تخصصی خرید و فروش قطعات کامپیوتر.",
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    type: "website",
    url: getSiteUrl(),
    siteName: "ریگورا",
    title: "ریگورا | اسمبل آنلاین سیستم و بازارچه قطعات کامپیوتر",
    description:
      "ریگورا؛ ابزار اسمبل آنلاین سیستم گیمینگ و بازارچه تخصصی خرید و فروش قطعات کامپیوتر.",
    images: [{ url: `${getSiteUrl()}/logo.png` }],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${getSiteUrl()}/logo.png`],
  },
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
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <script
          data-mantine-script
          dangerouslySetInnerHTML={{
            __html: `try{var a=localStorage.getItem("mantine-color-scheme-value"),b=a==="light"||a==="dark"||a==="auto"?a:"dark",c=b!=="auto"?b:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-mantine-color-scheme",c)}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ریگورا",
              alternateName: "Rigora",
              url: getSiteUrl(),
              inLanguage: "fa-IR",
            }),
          }}
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
