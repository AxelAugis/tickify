'use client';

import React from 'react';

export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div
          className={`w-screen h-screen bg-gradient-to-br from-accent-green from-10% to-accent-dark flex items-center justify-center `}
        >
          {children}
        </div>
    );
}