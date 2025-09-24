import { Suspense } from 'react';
import { useRoutes, type RouteObject } from 'react-router-dom';
import { routes } from './config.tsx';

export default function AppRouter() {
  const element = useRoutes(routes as unknown as RouteObject[]);
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}
