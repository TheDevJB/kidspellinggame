import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SpellingGameComponent } from './spelling-game/spelling-game.component';
import { WordFamilySelectionComponent } from './word-family-selection/word-family-selection.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'families', component: WordFamilySelectionComponent },
  { path: 'spelling', redirectTo: '/families', pathMatch: 'full' },
  { path: 'game/:familyId', component: SpellingGameComponent },
  { path: '**', redirectTo: '/home' }
];
