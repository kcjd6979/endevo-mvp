// app/layout.tsx
import '../styles/globals.css'; // This path says "go up one directory (..) then into 'styles' and find 'globals.css'"

export const metadata = {
  title: 'Endevo MVP', // You can customize your site title here
  description: 'An MVP for Endevo project', // And description
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}