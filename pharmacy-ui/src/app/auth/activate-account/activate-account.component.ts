import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CodeInputModule } from "angular-code-input";
import { NgIf } from "@angular/common";
import { AuthenticationApIsService } from '../../services/services/authentication-ap-is.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CodeInputModule,
    NgIf

  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthenticationApIsService);


  message = '';
  isOkay = true;
  submitted = false;
  isLoading = false;
  email = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      this.email = params.get('email') ?? '';

      // Support one-click account activation from email links.
      if (token && token.trim().length >= 6) {
        this.confirmAccount(token.trim());
      }
    });
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login'])
  }

  private confirmAccount(token: string) {
    this.isLoading = true;
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = "Your account has been successfully activated. Now you can proceed to login.";
        this.submitted = true;
        this.isOkay = true;
        this.isLoading = false;
      },
      error: () => {
        this.message = "Activation failed. The code may be invalid or expired. Please check and try again.";
        this.submitted = true;
        this.isOkay = false;
        this.isLoading = false;
      }
    })
  }
}
