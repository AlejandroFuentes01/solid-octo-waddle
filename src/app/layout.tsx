import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from ".././components/Providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Asistencia Tickets",
  description: "Sistema para la gestión de tickets en el área de telemática.",
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