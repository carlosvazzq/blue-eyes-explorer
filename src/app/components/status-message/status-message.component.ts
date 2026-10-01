import { Component, input } from '@angular/core';

export type StatusKind = 'loading' | 'empty' | 'error' | 'idle';

@Component({
  selector: 'app-status-message',
  template: `
    <div class="status" [class]="kind()" role="status">
      @if (kind() === 'loading') {
        <div class="spinner"></div>
        <p>Cargando...</p>
      } @else if (kind() === 'empty') {
        <p>{{ message() || 'No se encontraron cartas.' }}</p>
      } @else if (kind() === 'error') {
        <p>⚠️ {{ message() || 'Ocurrió un error.' }}</p>
      } @else {
        <p>{{ message() || 'Escribe al menos 2 letras para buscar.' }}</p>
      }
    </div>
  `,
  styles: [`
    .status { text-align:center; padding:2rem; color:#cbd5e1; }
    .status.error { color:#fca5a5; }
    .spinner { width:38px; height:38px; margin:0 auto 1rem; border:4px solid #1e3a8a;
      border-top-color:#60a5fa; border-radius:50%; animation:spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class StatusMessageComponent {
  kind = input.required<StatusKind>();
  message = input<string>();
}