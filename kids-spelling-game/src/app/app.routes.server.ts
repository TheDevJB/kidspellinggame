import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes that can be prerendered
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'families',
    renderMode: RenderMode.Prerender
  },
  // Dynamic route with parameters - use client-side rendering
  {
    path: 'game/**',
    renderMode: RenderMode.Client
  },
  // Fallback for any other routes
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
