import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wipsy - A Notepad like interface for temporary data storage",
  description:
    "Store your temporary notes in a Notepad like interface with Wipsy. A free and open-source web app. built with Next.js. Data Storage for a Day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6735650696008555"
     crossorigin="anonymous"></script>
     <meta name="google-adsense-account" content="ca-pub-6735650696008555"></meta>
      </head>
      <body className={`${inter.className} bg-[#09090b] text-[#fafafa]`}>
        <div className=" h-[100dvh] flex flex-col ">
          <Navbar />
          <div className="flex-1 h-full w-full ">
            {children}
            </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
