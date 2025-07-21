// app/layout.tsx
import './globals.css'; // Corrected import path

// Optional: Import Google Fonts if you plan to use 'Montserrat'
// import { Montserrat } from 'next/font/google';

// Optional: Initialize Montserrat font
// const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: 'Endevo MVP',
  description: 'An MVP for Endevo project\'s development', // Corrected HTML entity
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Optional: Apply font class if using next/font */}
      {/* <html lang="en" className={montserrat.className}> */}
      <body>{children}</body>
    </html>
  );
}