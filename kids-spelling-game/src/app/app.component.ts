// ANGULAR IMPORTS
// These are Angular's built-in modules and features we need
import { Component, OnInit } from '@angular/core'; // Component decorator and OnInit lifecycle hook
import { RouterOutlet } from '@angular/router'; // Router outlet for displaying routed components
import { ThemeService } from './services/theme.service'; // Our custom service for theme management

// COMPONENT DECORATOR
// @Component is a decorator that tells Angular this class is a component
// Decorators add metadata to classes, methods, or properties
@Component({
  selector: 'app-root', // HTML tag name where this component will be used: <app-root></app-root>
  standalone: true, // This is a standalone component (Angular 17+ feature) - doesn't need NgModule
  imports: [RouterOutlet], // Other components/modules this component uses
  templateUrl: './app.component.html', // Path to the HTML template file
  styleUrl: './app.component.css' // Path to the CSS styles file
})

// COMPONENT CLASS
// This class contains the component's logic and data
export class AppComponent implements OnInit {
  // COMPONENT PROPERTIES
  // These are variables that belong to this component
  title = 'kids-spelling-game'; // Component property - can be used in the template

  // DEPENDENCY INJECTION
  // Constructor is where we inject services (dependencies) that this component needs
  // Angular's dependency injection system automatically provides instances of services
  constructor(private themeService: ThemeService) {
    // 'private' makes themeService available throughout this component
    // Angular will automatically create/provide an instance of ThemeService
  }

  // LIFECYCLE HOOKS
  // ngOnInit is called after Angular initializes the component
  // This is where you put initialization logic (like loading data)
  ngOnInit(): void {
    // Initialize theme on app start
    // Get the current theme from the service and apply it
    this.themeService.setTheme(this.themeService.getCurrentTheme());
  }
}
