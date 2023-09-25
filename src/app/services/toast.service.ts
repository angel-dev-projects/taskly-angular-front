import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Define an enum for different types of toast notifications
export enum toastTypes {
  error,
  success,
}

// Define the interface for Toast data
export interface ToastData {
  title: string;
  content: string;
  show?: boolean;
  type?: toastTypes;
  progressWidth?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  data!: ToastData;
  public open = new Subject<ToastData>(); // Subject to communicate with subscribers

  // Function to initiate and show the toast
  initiate(data: ToastData) {
    // Check if the data contains a "type" property and set it to "error" (assuming type is not provided)
    if (data.type) {
      this.data.type = toastTypes.error;
    }

    // Update the "data" property with the new toast data, set "show" to true, and set initial progressWidth to '100%'
    this.data = { ...data, show: true, progressWidth: '100%' };

    // Notify subscribers about the new toast data using the "open" Subject
    this.open.next(this.data);
  }

  // Function to hide the toast
  hide() {
    // Update the "data" property to hide the toast by setting "show" to false
    this.data = { ...this.data, show: false };

    // Notify subscribers about the updated toast data (to hide the toast)
    this.open.next(this.data);
  }
}
