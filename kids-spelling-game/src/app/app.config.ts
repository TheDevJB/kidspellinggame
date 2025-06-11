// ANGULAR APPLICATION CONFIGURATION
// This file sets up the core services and features your Angular app will use
// Think of it as the "settings" file for your entire application

// ANGULAR CORE IMPORTS
import { ApplicationConfig } from '@angular/core'; // Type definition for app configuration
import { provideRouter, withViewTransitions } from '@angular/router'; // Routing system for navigation
import { provideHttpClient } from '@angular/common/http'; // HTTP client for API calls

// ROUTE CONFIGURATION IMPORT
import { routes } from './app.routes'; // Your app's navigation routes

// APPLICATION CONFIGURATION OBJECT
// This object tells Angular what services and features to make available throughout your app
export const appConfig: ApplicationConfig = {
  providers: [
    // ROUTING PROVIDER
    // Sets up the router service so your app can navigate between different pages/components
    // withViewTransitions() adds smooth animations when switching between routes
    provideRouter(routes, withViewTransitions()),
    
    // HTTP CLIENT PROVIDER
    // Makes the HttpClient service available throughout your app
    // This allows your components and services to make API calls to your backend
    // Without this, you couldn't fetch data from your Node.js server
    provideHttpClient()
  ]
};
