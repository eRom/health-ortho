import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./next-intl.request.ts",
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Définir la racine du projet pour éviter le warning sur les lockfiles multiples
  output: "standalone",
  outputFileTracingRoot: "/Users/recarnot/dev/health-ortho",

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-slot",
      "clsx",
      "tailwind-merge",
    ],
    optimizeCss: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },

  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// Options de configuration Sentry
const sentryConfig = {
  // Pour plus d'options: https://github.com/getsentry/sentry-webpack-plugin#options
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Seulement upload les source maps en production
  silent: process.env.NODE_ENV !== "production",

  // Désactiver les logs Sentry pendant le build
  hideSourceMaps: true,

  // Désactiver automatiquement Sentry en dev
  disableLogger: true,

  // Source maps uniquement en production
  widenClientFileUpload: true,

  // Désactiver l'upload des source maps en dev
  automaticVercelMonitors: true,
};

// Exporter avec Sentry et next-intl
export default withSentryConfig(withNextIntl(nextConfig), sentryConfig);
