import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow - To-Do List',
  description: 'Современный и быстрый менеджер задач на Next.js и NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full antialiased font-sans bg-radial-[at_50%_0%] from-slate-900 to-slate-950">
        {children}
      </body>
    </html>
  );
}
