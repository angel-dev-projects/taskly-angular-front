import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if the user is logged in by calling the "loggedIn" method of the "AuthService" service
    if (this.authService.loggedIn()) {
      return true; // Allows browsing if the user is logged in
    }

    // If the user is not logged in, redirect to the authentication page ("/auth")
    this.router.navigate(['/auth']);
    return false; // Does not allow navigation
  }
}
