
import "./globals.css";
import  {ClerkProvider}  from "@clerk/nextjs";
import Provider from "./provider";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({subsets:['latin']});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={outfit.className}
      >
        <Provider>
        {children}
        </Provider>
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}
