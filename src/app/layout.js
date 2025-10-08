import { Geist, Geist_Mono } from "next/font/google";
import "../styles/tailwind.css";
import "../styles/index.css";
import Header from "@/components/ui/Header";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UpImage - Built for designers, marketers, and everyday creators who want fast, professional results without technical hassle.",
  description: `UpImage is an all-in-one AI-powered platform for image and document enhancement.
From background removal and image restoration to AI generation and PDF summarization, UpImage gives you powerful creative tools in one seamless workspace`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
