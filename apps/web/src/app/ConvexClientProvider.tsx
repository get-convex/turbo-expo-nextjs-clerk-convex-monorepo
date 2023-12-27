'use client';
import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from '@notes/db';

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convex = new ConvexReactClient(
  'https://giddy-kookabura-511.convex.cloud'
);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
