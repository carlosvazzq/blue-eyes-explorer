import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <h1>Blue-Eyes Card Explorer</h1>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Buscador</a>
        <a routerLink="/blue-eyes" routerLinkActive="active">Blue-Eyes Collection</a>
      </nav>
    </header>
    <main class="container"><router-outlet /></main>
  `,
  styles: [`
    .navbar { display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;
      padding:.9rem 1.5rem; background:#0b1b3a; border-bottom:2px solid #3b82f6; }
    h1 { margin:0; font-size:1.3rem; color:#93c5fd; }
    nav { display:flex; gap:1rem; }
    nav a { color:#cbd5e1; text-decoration:none; padding:.3rem .7rem; border-radius:6px; }
    nav a.active, nav a:hover { background:#1d4ed8; color:#fff; }
    .container { max-width:1200px; margin:0 auto; padding:1.5rem; }
  `],
})
export class App {}