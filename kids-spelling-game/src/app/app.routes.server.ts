import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
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
  {
    path: 'game/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'colors',
    renderMode: RenderMode.Client
  },
  {
    path: 'sentences',
    renderMode: RenderMode.Client
  },
  {
    path: 'capitalization',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
