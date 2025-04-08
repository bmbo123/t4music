"use client";
import { Suspense } from 'react';

import ListenerHome from "@/components/ui/home";

export default function HomePage() {
  return (
    <div>
      <Suspense>
        <ListenerHome />
      </Suspense>
    </div>
  );
}
// this was very wrong so i fixed my mistakes LOL