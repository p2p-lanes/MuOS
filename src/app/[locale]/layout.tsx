import { Metadata } from "next";
import "@/styles/globals.css";
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { GeistSans } from 'geist/font/sans';
import GoogleAnalytics from "@/components/utils/GoogleAnalytics";
import { Toaster } from "sonner";
import { config } from "@/constants/config";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: config.metadata.title,
  description: config.metadata.description,
  icons: {
    icon: config.metadata.icon,
  },
  openGraph: {
    title: config.metadata.openGraph.title,
    description: config.metadata.openGraph.description,
    type: config.metadata.openGraph.type as "website",
    siteName: config.metadata.openGraph.siteName,
    images: [{
      url: config.metadata.openGraph.images[0].url,
      width: config.metadata.openGraph.images[0].width,
      height: config.metadata.openGraph.images[0].height,
      alt: config.metadata.openGraph.images[0].alt,
    }]
  },
  twitter: {
    card: config.metadata.twitter.card as "summary_large_image",
    title: config.metadata.twitter.title,
    description: config.metadata.twitter.description,
    images: config.metadata.twitter.images,
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <MiniKitProvider>
          <NextIntlClientProvider messages={messages}>
            <div className={`${GeistSans.className} antialiased w-[100%] bg-neutral-100`}>
              {children}
            </div>
          </NextIntlClientProvider>
        </MiniKitProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
