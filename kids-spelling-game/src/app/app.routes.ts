import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SpellingGameComponent } from './spelling-game/spelling-game.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'spelling', component: SpellingGameComponent }
];
