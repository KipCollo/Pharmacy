import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationApIsService } from '../../services/services/authentication-ap-is.service';
import { TokenService } from '../../services/token/token.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationApIsService);
  private tokenService = inject(TokenService);
  hide = signal<boolean>(true);

  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.setAuthTokens(res.token ?? null, res.refreshToken ?? null);
        const roles: string[] = this.tokenService.getRoles()

        if (roles.includes('ADMIN')) {
          this.router.navigate(['/admin']);
        }
        else if (roles.includes('USER')) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.log(err);
        const validationErrors = err?.error?.validationErrors;
        const errorMessage = err?.error?.error;

        if (Array.isArray(validationErrors) && validationErrors.length) {
          this.errorMsg = validationErrors;
        } else if (typeof errorMessage === 'string' && errorMessage.length) {
          this.errorMsg.push(errorMessage);
        } else {
          this.errorMsg.push('Login failed. Please try again.');
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }

}

