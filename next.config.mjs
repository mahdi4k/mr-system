import bundleAnalyzer from "@next/bundle-analyzer";
import withPWAInit from "@ducanh2912/next-pwa";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  dest: "public",
  fallbacks: {
    //image: "/static/images/fallback.png",
    document: "/offline", // if you want to fallback to a custom page rather than /_offline
    // font: '/static/font/fallback.woff2',
    // audio: ...,
    // video: ...,
  },
  workboxOptions: {
    disableDevLogs: true,
  },
});

// Compose the configurations
export default withPWA(
  withBundleAnalyzer({
    reactStrictMode: false,
    output: "standalone",
    experimental: {
      optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "127.0.0.1",
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "image.torob.com",
          pathname: "/**",
        },
        ...(supabaseHostname
          ? [
              {
                protocol: "https",
                hostname: supabaseHostname,
                pathname: "/storage/v1/object/public/**",
              },
            ]
          : []),
      ],
    },
    // Add any additional Next.js config options here
  }),
);
