import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { YugiohCard } from '../../models/yugioh.model';

@Component({
  selector: 'app-card',
  template: `
    <article class="card" tabindex="0" role="button" [class.active]="active()"
             (click)="open()" (keydown.enter)="open()">
      @if (image()) {
        <img [src]="image()" [alt]="card().name" loading="lazy" />
      } @else {
        <div class="no-img">Sin imagen</div>
      }
      <h3>{{ card().name }}</h3>
      <ul>
        <li><b>Tipo:</b> {{ card().type }}</li>
        @if (card().attribute) { <li><b>Atributo:</b> {{ card().attribute }}</li> }
        @if (card().level != null) { <li><b>Nivel:</b> {{ card().level }}</li> }
        @if (card().atk != null) { <li><b>ATK:</b> {{ card().atk }}</li> }
        @if (card().def != null) { <li><b>DEF:</b> {{ card().def }}</li> }
      </ul>
    </article>
  `,
  styles: [`
    .card { background:#12244a; border:1px solid #1e3a8a; border-radius:10px; padding:.8rem;
      cursor:pointer; height:100%; transition:transform .15s, border-color .15s; }
    .card:hover, .card:focus-visible, .card.active { transform:translateY(-3px); border-color:#60a5fa; outline:none; }
    img { width:100%; border-radius:6px; aspect-ratio:3/4.4; object-fit:cover; background:#0b1b3a; }
    .no-img { aspect-ratio:3/4.4; display:grid; place-items:center; background:#0b1b3a; border-radius:6px; color:#64748b; }
    h3 { font-size:1rem; margin:.6rem 0 .3rem; color:#e0f2fe; }
    ul { list-style:none; margin:0; padding:0; font-size:.85rem; color:#cbd5e1; }
  `],
})
export class CardComponent {
  private readonly router = inject(Router);

  card = input.required<YugiohCard>();
  navigateOnClick = input(true);
  active = input(false);
  selected = output<YugiohCard>();

  image = computed(() => this.card().card_images?.[0]?.image_url_small ?? '');

  open(): void {
    this.selected.emit(this.card());
    if (this.navigateOnClick()) {
      this.router.navigate(['/card', this.card().id]);
    }
  }
}
