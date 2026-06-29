import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './cliente-layout.html',
  styleUrl: './cliente-layout.css'
})
export class ClienteLayoutComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  funSalir(): void {
    this.authService.funLogout();
    this.router.navigate(['/login']);
  }
}