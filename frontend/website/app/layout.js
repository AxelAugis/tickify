import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout/Layout";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({ 
    subsets: ["latin"] ,
    weight: [
        "400",
        "500",
        "600",
        "700"
    ]
});

export const metadata = {
  title: "Tickify | Gérer vos projets",
  description: "Tickify est une application de gestion de projets",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
