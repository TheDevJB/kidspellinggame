import { Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { SpellingGameComponent } from './spelling-game/spelling-game.component';
import { WordFamilySelectionComponent } from './word-family-selection/word-family-selection.component';
import { ColorLearningComponent } from './color-learning/color-learning.component';
import { SentenceBuildingComponent } from './sentence-building/sentence-building.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  { path: 'home', component: HomePageComponent },
  
  { path: 'colors', component: ColorLearningComponent },
  
  { path: 'sentences', component: SentenceBuildingComponent },
  
  { path: 'capitalization', component: SentenceBuildingComponent },
  
  { path: 'families', component: WordFamilySelectionComponent },
  
  { path: 'spelling', redirectTo: '/families', pathMatch: 'full' },
  
  { path: 'game/:familyId', component: SpellingGameComponent },
  
  { path: '**', redirectTo: '/home' }
];
