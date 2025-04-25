'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="p-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm border-t">
      <p className="flex items-center justify-center gap-1">
        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Next.js
        </a>
        ,{' '}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Tailwind CSS
        </a>
        ,{' '}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          shadcn/ui
        </a>
        {' '}and deployed with{' '}
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Vercel
        </a>
      </p>
    </footer>
  );
} 