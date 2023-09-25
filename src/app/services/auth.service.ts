import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Login } from '../interfaces/login.interface';
import { Register } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(register_form: Register) {
    // Makes an HTTP POST request to the server to register a new user
    return this.http.post<any>(this.URL + 'auth/register', register_form);
  }

  logIn(login_form: Login) {
    // Makes an HTTP POST request to the server to log in with the user's credentials
    return this.http.post<any>(this.URL + 'auth/login', login_form);
  }

  loggedIn() {
    // Checks if the token is present in local storage and returns a boolean value
    return !!localStorage.getItem('token');
  }

  getToken() {
    // Get token from local storage
    return localStorage.getItem('token');
  }

  logOut() {
    // Remove token from local storage and redirect user to auth page
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
}
