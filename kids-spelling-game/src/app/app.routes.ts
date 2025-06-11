// ANGULAR ROUTING IMPORTS
import { Routes } from '@angular/router'; // Routes type for defining navigation routes

// COMPONENT IMPORTS
// Import all the components that will be displayed when users navigate to different URLs
import { HomePageComponent } from './home-page/home-page.component';
import { SpellingGameComponent } from './spelling-game/spelling-game.component';
import { WordFamilySelectionComponent } from './word-family-selection/word-family-selection.component';
import { ColorLearningComponent } from './color-learning/color-learning.component';
import { SentenceBuildingComponent } from './sentence-building/sentence-building.component';

// ROUTE CONFIGURATION
// Routes array defines which component to show for each URL path
// Angular Router uses this configuration to navigate between different views
export const routes: Routes = [
  // DEFAULT ROUTE - When user visits the root URL (/), redirect to /home
  // pathMatch: 'full' means the entire URL must match exactly
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // HOME ROUTE - Display the home page component when URL is /home
  { path: 'home', component: HomePageComponent },
  
  // COLOR LEARNING ROUTES - For Pre-K and Kindergarten color activities
  // :grade parameter allows different content based on grade level
  { path: 'colors/:grade', component: ColorLearningComponent },
  
  // SENTENCE BUILDING ROUTES - For Kindergarten and up sentence activities
  // :grade parameter allows different content based on grade level
  { path: 'sentences/:grade', component: SentenceBuildingComponent },
  
  // CAPITALIZATION ROUTES - For Kindergarten and up capitalization learning
  // :grade parameter allows different content based on grade level
  { path: 'capitalization/:grade', component: SentenceBuildingComponent },
  
  // WORD FAMILIES ROUTE - Display word family selection when URL is /families
  { path: 'families', component: WordFamilySelectionComponent },
  
  // SPELLING REDIRECT - If someone goes to /spelling, redirect them to /families
  // This maintains backward compatibility or handles old bookmarks
  { path: 'spelling', redirectTo: '/families', pathMatch: 'full' },
  
  // DYNAMIC ROUTE WITH PARAMETER - :familyId is a route parameter
  // Example: /game/at, /game/ing, etc. - familyId will be 'at', 'ing', etc.
  // The component can access this parameter to know which word family to load
  { path: 'game/:familyId', component: SpellingGameComponent },
  
  // WILDCARD ROUTE - ** matches any URL that doesn't match the routes above
  // This is a "catch-all" route for 404 errors - redirects unknown URLs to home
  // IMPORTANT: This must be the LAST route in the array
  { path: '**', redirectTo: '/home' }
];
