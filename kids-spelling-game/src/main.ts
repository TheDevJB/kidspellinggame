// MAIN APPLICATION ENTRY POINT
// This file is the starting point of your Angular application
// It's like the "main()" function in other programming languages

// ANGULAR IMPORTS
// Import the function that starts up (bootstraps) an Angular application
import { bootstrapApplication } from '@angular/platform-browser';

// Import the application configuration (routes, providers, etc.)
import { appConfig } from './app/app.config';

// Import the root component that will be the foundation of your app
import { AppComponent } from './app/app.component';

// BOOTSTRAP THE APPLICATION
// This function starts your Angular application
// It takes two parameters:
// 1. AppComponent - The main component that contains your entire app
// 2. appConfig - Configuration settings (routing, services, etc.)
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // If something goes wrong during startup, log the error
