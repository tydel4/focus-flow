'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="p-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm border-t">
      <div className="max-w-2xl mx-auto">
        <p className="flex flex-wrap items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary whitespace-nowrap"
          >
            Next.js
          </a>
          ,{' '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary whitespace-nowrap"
          >
            Tailwind CSS
          </a>
          ,{' '}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary whitespace-nowrap"
          >
            shadcn/ui
          </a>
          {' '}and deployed with{' '}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary whitespace-nowrap"
          >
            Vercel
          </a>
        </p>
      </div>
    </footer>
  );
} 