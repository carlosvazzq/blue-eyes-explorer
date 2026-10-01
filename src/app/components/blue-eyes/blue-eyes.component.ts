import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { toLoadState } from '../../models/load-state.model';
import { YugiohCard } from '../../models/yugioh.model';
import { YugiohService } from '../../services/yugioh.service';
import { CardComponent } from '../card/card.component';
import { PrintingsTableComponent } from '../printings-table/printings-table.component';
import { StatusKind, StatusMessageComponent } from '../status-message/status-message.component';

interface ViewModel {
  kind: StatusKind | null;     // null = mostrar resultados
  message?: string;
  expansions: string[];
  filtered: YugiohCard[];
  set: string;
  total: number;
}

@Component({
  selector: 'app-blue-eyes',
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink, CardComponent, PrintingsTableComponent, StatusMessageComponent],
  template: `
    <h2>Blue-Eyes Collection</h2>

    @if (vm$ | async; as vm) {
      @if (vm.expansions.length) {
        <div class="filters">
          <label for="exp">Expansión:</label>
          <select id="exp" [formControl]="selectedSet">
            <option value="">Todas las expansiones</option>
            @for (e of vm.expansions; track e) { <option [value]="e">{{ e }}</option> }
          </select>
          <span class="count">{{ vm.filtered.length }} cartas · {{ vm.expansions.length }} expansiones</span>
        </div>
      }

      @if (vm.kind) {
        <app-status-message [kind]="vm.kind" [message]="vm.message" />
      } @else {
        @if (selected(); as sel) {
          @if (isVisible(sel, vm.filtered)) {
            <section class="panel">
              <h3>{{ sel.name }}</h3>
              <app-printings-table [sets]="sel.card_sets" [highlight]="vm.set || null" />
              <a [routerLink]="['/card', sel.id]">Ver detalle completo →</a>
            </section>
          }
        }
        <div class="grid">
          @for (c of vm.filtered; track c.id) {
            <app-card [card]="c" [navigateOnClick]="false" [active]="selected()?.id === c.id"
                      (selected)="selected.set($event)" />
          }
        </div>
      }
    }
  `,
  styles: [`
    .filters { display:flex; flex-wrap:wrap; gap:.8rem; align-items:center; margin-bottom:1rem; }
    select { padding:.5rem; border-radius:6px; background:#0b1b3a; color:#fff; border:1px solid #3b82f6; max-width:100%; }
    .count { color:#93c5fd; }
    .panel { background:#12244a; border:1px solid #3b82f6; border-radius:10px; padding:1rem; margin-bottom:1rem; }
    .panel a { color:#93c5fd; }
  `],
})
export class BlueEyesComponent {
  private readonly service = inject(YugiohService);

  selectedSet = new FormControl('', { nonNullable: true });
  selected = signal<YugiohCard | null>(null);

  vm$ = combineLatest([
    toLoadState(this.service.getBlueEyes()),
    this.selectedSet.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([state, set]): ViewModel => {
      if (state.status !== 'success') {
        return {
          kind: state.status === 'error' || state.status === 'loading' || state.status === 'empty' || state.status === 'idle'
            ? state.status : null,
          message: state.status === 'error' ? state.message : undefined,
          expansions: [], filtered: [], set, total: 0,
        };
      }
      const cards = state.data;
      // Expansiones calculadas desde la API, sin duplicados (Set) y ordenadas
      const expansions = [...new Set(cards.flatMap((c) => c.card_sets?.map((s) => s.set_name) ?? []))].sort();
      // Filtro dinámico por expansión
      const filtered = set ? cards.filter((c) => c.card_sets?.some((s) => s.set_name === set)) : cards;
      return {
        kind: filtered.length ? null : 'empty',
        expansions, filtered, set, total: cards.length,
      };
    })
  );

  isVisible(card: YugiohCard, list: YugiohCard[]): boolean {
    return list.some((c) => c.id === card.id);
  }
}