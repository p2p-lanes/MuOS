import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'simplefi.s3.us-east-2.amazonaws.com',
      },
    ],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
