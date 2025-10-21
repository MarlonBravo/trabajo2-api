import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] 
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  isAuthenticated = false; 

  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        alert('Credenciales incorrectas');
        console.error(err);
      }
    });
  }
}