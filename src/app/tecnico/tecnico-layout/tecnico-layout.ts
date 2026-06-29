import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-tecnico-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './tecnico-layout.html',
  styleUrl: './tecnico-layout.css'
})
export class TecnicoLayoutComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  funSalir(): void {
    this.authService.funLogout();
    this.router.navigate(['/login']);
  }
}