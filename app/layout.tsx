import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: "---font-poppins"
});

export const metadata: Metadata = {
  title: "ZEST UP",
  description: "Manage your event",
  icons: {
    icon: '/assets/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#fc495b'
        },
        elements: {
          formButtonPrimary:
            "bg-[#fc495b] hover:bg-[#f76a79] text-sm normal-case",
        },
      }}
    >

      <html lang="en">
        <body className={poppins.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
