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
    path: 'colors/:grade',
    renderMode: RenderMode.Client
  },
  {
    path: 'sentences/:grade',
    renderMode: RenderMode.Client
  },
  {
    path: 'capitalization/:grade',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
