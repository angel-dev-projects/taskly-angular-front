// Import necessary modules and services
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  // Subject to emit the loading state
  isLoading$ = new Subject<boolean>();

  // Method to show the spinner
  show(): void {
    this.isLoading$.next(true);
  }

  // Method to hide the spinner
  hide(): void {
    this.isLoading$.next(false);
  }
}
