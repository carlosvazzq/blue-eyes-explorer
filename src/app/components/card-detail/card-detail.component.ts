import { AsyncPipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoadState, toLoadState } from '../../models/load-state.model';
import { YugiohCard } from '../../models/yugioh.model';
import { YugiohService } from '../../services/yugioh.service';
import { PrintingsTableComponent } from '../printings-table/printings-table.component';
import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-card-detail',
  imports: [AsyncPipe, PrintingsTableComponent, StatusMessageComponent],
  template: `
    <button class="back" (click)="back()">← Volver</button>

    @if (state$ | async; as state) {
      @if (state.status === 'success') {
        @for (card of state.data; track card.id) {
          <section class="detail">
            @if (card.card_images?.[0]; as img) {
              <img [src]="img.image_url" [alt]="card.name" />
            }
            <div class="info">
              <h2>{{ card.name }}</h2>
              <p><b>Tipo:</b> {{ card.type }}</p>
              <p><b>Atributo:</b> {{ card.attribute ?? '—' }}</p>
              <p><b>Nivel:</b> {{ card.level ?? '—' }}</p>
              <p><b>ATK:</b> {{ card.atk ?? '—' }} &nbsp; <b>DEF:</b> {{ card.def ?? '—' }}</p>
              <p><b>Arquetipo:</b> {{ card.archetype ?? '—' }}</p>
              <p class="desc"><b>Descripción:</b><br />{{ card.desc }}</p>
            </div>
          </section>
          <h3>Impresiones</h3>
          <app-printings-table [sets]="card.card_sets" />
        }
      } @else if (state.status === 'error') {
        <app-status-message kind="error" [message]="state.message" />
      } @else {
        <app-status-message [kind]="state.status === 'idle' ? 'idle' : state.status" />
      }
    }
  `,
  styles: [`
    .back { background:#1d4ed8; color:#fff; border:0; padding:.5rem 1rem; border-radius:6px; cursor:pointer; margin-bottom:1rem; }
    .detail { display:flex; flex-wrap:wrap; gap:1.5rem; }
    img { width:100%; max-width:320px; border-radius:10px; }
    .info { flex:1; min-width:260px; }
    .desc { white-space:pre-line; }
  `],
})
export class CardDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(YugiohService);
  private readonly location = inject(Location);

  state$: Observable<LoadState<YugiohCard[]>> = this.route.paramMap.pipe(
    map((p) => p.get('id') ?? ''),
    switchMap((id) =>
      toLoadState(this.service.getById(id).pipe(map((c) => (c ? [c] : []))))
    )
  );

  back(): void {
    this.location.back();
  }
}

