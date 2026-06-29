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
      next: (res) => {
  const role = res.user.role;
  console.log('rol recibido:', res.user.role);
  if (role === 'Admin') {
    this.router.navigate(['/admin/servicios']);
  } else if (role === 'Tecnico') {
    this.router.navigate(['/tecnico/servicios-asignados']);
  } else {
    this.errorLogin.set('No tienes acceso al sistema.');
  }
},
      error: (err) => {
        console.error(err);
        this.errorLogin.set('Credenciales incorrectas o usuario no autorizado.');
      }
    });
  }
}