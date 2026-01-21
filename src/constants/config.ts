import icon from '../../public/icon.png'

export const config = {
  metadata: {
    title: "The Mu Portal",
    description: "Welcome to the The Mu Portal. Log in or sign up to access The Mu events.",
    icon: icon.src,
    openGraph: {
      title: "The Mu Portal",
      description: "Welcome to the The Mu Portal. Log in or sign up to access The Mu events.",
      images: [{
        url: "https://simplefi.s3.us-east-2.amazonaws.com/background.png",
        alt: "The Mu Portal",
        width: 1200,
        height: 630,
      }],
      type: "website",
      siteName: "The Mu Portal",
    },
    twitter: {
      card: "summary_large_image",
      title: "The Mu Portal",
      description: "Welcome to the The Mu Portal. Log in or sign up to access The Mu events.",
      images: ["https://simplefi.s3.us-east-2.amazonaws.com/background.png"],
    },
  },
  name: "The Mu Portal",
}

