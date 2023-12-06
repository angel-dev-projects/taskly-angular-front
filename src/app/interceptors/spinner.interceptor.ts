// Import necessary modules and services
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  // Constructor to inject SpinnerService
  constructor(private spinnerService: SpinnerService) {}

  // Interceptor method to show and hide the spinner during HTTP requests
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Show the spinner before making the HTTP request
    this.spinnerService.show();

    // Continue with the HTTP request and hide the spinner when it completes
    return next.handle(req).pipe(finalize(() => this.spinnerService.hide()));
  }
}
