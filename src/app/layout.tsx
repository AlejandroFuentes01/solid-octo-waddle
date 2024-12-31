import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from ".././components/Providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Asistencia Tickets",
  description: "Sistema para la gestión de tickets en el área de telemática.",
  icons: {
    icon: '/DComalaFlavicon.svg', // 16x16 px
    apple: '/DComalaApple.png', // 180x180 px
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </body>
      </html>
    </Providers>
  )
}