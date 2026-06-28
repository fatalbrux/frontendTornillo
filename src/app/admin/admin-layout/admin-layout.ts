import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  salir(): void {
    this.authService.funLogout();
    this.router.navigate(['/login']);
  }
}