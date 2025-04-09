import { Suspense } from 'react';
import ListenerHome from '@/components/ui/home';

export default function ListenerMePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListenerHome />
    </Suspense>
  );
}