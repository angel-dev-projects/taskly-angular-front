import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    // Define animations for opening and closing the toast
    trigger('openClose', [
      state(
        'closed',
        style({
          visibility: 'hidden',
          right: '-400px',
        })
      ),
      state(
        'open',
        style({
          right: '40px',
        })
      ),
      transition('open <=> closed', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class ToastComponent {
  @ViewChild('element', { static: false }) progressBar!: ElementRef;
  progressInterval: any;

  // Constructor to inject the ToastService dependency
  constructor(public toastService: ToastService) {
    // Subscribe to the "open" event of the ToastService
    // When a new toast is shown, trigger the countdown
    this.toastService.open.subscribe((data) => {
      if (data.show) {
        this.countDown();
      }
    });
  }

  // Function to handle the countdown animation for the toast
  countDown() {
    // Set the initial width of the progress bar based on the progressWidth from ToastService
    this.progressBar.nativeElement.style.width =
      this.toastService.data.progressWidth;

    // Create an interval to decrease the width of the progress bar gradually
    this.progressInterval = setInterval(() => {
      // Get the current width of the progress bar
      const width = parseInt(this.progressBar.nativeElement.style.width, 10);

      // When the progress bar reaches 0, hide the toast and clear the interval
      if (width <= 0) {
        this.toastService.hide();
        clearInterval(this.progressInterval);
        return;
      }

      // Reduce the progress width and update the width of the progress bar accordingly
      this.toastService.data.progressWidth = String(width - 2);
      this.progressBar.nativeElement.style.width =
        this.toastService.data.progressWidth + '%';
    }, 75);
  }

  // Function to stop the countdown interval (used when the toast is manually closed)
  stopCountDown() {
    clearInterval(this.progressInterval);
  }
}
