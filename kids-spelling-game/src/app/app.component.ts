import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'kids-spelling-game';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme on app start
    this.themeService.setTheme(this.themeService.getCurrentTheme());
  }
}
