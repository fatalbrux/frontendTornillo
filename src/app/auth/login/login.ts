import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly errorLogin = signal<string | null>(null);

  protected credenciales = {
    ci: '',
    password: ''
  };

  funLogin(): void {
    this.errorLogin.set(null);
    
    this.authService.funLogin(this.credenciales).subscribe({
      next: () => {
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        console.error(err);
        this.errorLogin.set('Credenciales incorrectas o usuario no autorizado.');
      }
    });
  }
}