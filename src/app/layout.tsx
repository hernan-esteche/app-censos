import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title:
		"Registro de Visitas | Proyecto Cuenca Lambaré — Contraloría Ciudadana",
	description:
		"Plataforma de relevamiento y registro de datos para la evaluación del acceso al agua potable, saneamiento básico y participación ciudadana en la Cuenca de Lambaré.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="es"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex flex-col min-h-full">{children}</body>
		</html>
	);
}
