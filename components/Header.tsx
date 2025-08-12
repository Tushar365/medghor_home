'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <div className="flex items-center">
        {/* Replace with your actual logo component or image */}
        <Link href="/">
          <span className="text-xl font-bold">Medghor</span>
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/wholesale" className="hover:underline">
              Wholesale
            </Link>
          </li>
          <li>
            <Link href="/retail" className="hover:underline">
              Retail
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/office" className="hover:underline">
              Office
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}