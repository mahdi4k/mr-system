import bundleAnalyzer from "@next/bundle-analyzer";
import withPWAInit from "@ducanh2912/next-pwa";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = withPWAInit({
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  reloadOnOnline: false,
  dest: "public",
  publicExcludes: [
    "!sw.js",
    "!workbox-*.js",
    "!worker-*.js",
    "!fallback-*.js",
    "!swe-worker-*.js",
  ],
  workboxOptions: {
    disableDevLogs: true,
    // Next.js build assets remain precached, but all application data stays online-only.
    runtimeCaching: [],
  },
});

// Compose the configurations
export default withPWA(
  withBundleAnalyzer({
    reactStrictMode: false,
    output: "standalone",
    experimental: {
      optimizePackageImports: [
        "@mantine/core",
        "@mantine/hooks",
        "@mantine/carousel",
        "@mantine/notifications",
        "@tabler/icons-react",
      ],
    },
    images: {
      formats: ["image/avif", "image/webp"],
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
