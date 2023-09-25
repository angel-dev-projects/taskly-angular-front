import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    // Create a reactive form for login with validations
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Create a reactive form for user registration with validations
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  ngOnInit() {
    const formInputs = this.el.nativeElement.querySelectorAll('.form input');
    const tabLinks = this.el.nativeElement.querySelectorAll('.tab a');

    formInputs.forEach((input: any) => {
      this.renderer.listen(input, 'keyup', (e) => {
        const $this = e.target;
        const label = $this.previousElementSibling;

        if (e.type === 'keyup') {
          if ($this.value === '') {
            this.renderer.removeClass(label, 'active');
            this.renderer.removeClass(label, 'highlight');
          } else {
            this.renderer.addClass(label, 'active');
            this.renderer.addClass(label, 'highlight');
          }
        }
      });

      this.renderer.listen(input, 'blur', (e) => {
        const $this = e.target;
        const label = $this.previousElementSibling;

        if ($this.value === '') {
          this.renderer.removeClass(label, 'active');
        } else {
          this.renderer.removeClass(label, 'highlight');
        }
      });

      this.renderer.listen(input, 'focus', (e) => {
        const $this = e.target;
        const label = $this.previousElementSibling;

        if ($this.value === '') {
          this.renderer.removeClass(label, 'highlight');
        } else {
          this.renderer.addClass(label, 'highlight');
        }
      });
    });

    tabLinks.forEach((link: any) => {
      this.renderer.listen(link, 'click', (e) => {
        e.preventDefault();

        const $this = e.target;
        const tab = $this.parentElement;
        const tabs = this.el.nativeElement.querySelectorAll('.tab');
        const target = $this.getAttribute('href').substring(1);

        tab.classList.add('active');
        tabs.forEach((t: { classList: { remove: (arg0: string) => void } }) => {
          if (t !== tab) {
            t.classList.remove('active');
          }
        });

        const tabContents =
          this.el.nativeElement.querySelectorAll('.tab-content > div');
        tabContents.forEach((content: { id: any }) => {
          if (content.id !== target) {
            this.renderer.setStyle(content, 'display', 'none');
          } else {
            this.renderer.setStyle(content, 'display', 'block');
          }
        });
      });
    });
  }

  register() {
    // Call the register method of the authentication service to register the user
    this.authService
      .register(this.registerForm.value)
      .pipe(
        switchMap((res) => {
          // Store the access token in local storage
          localStorage.setItem('token', res.token);
          // Redirect to the 'home' component
          return this.router.navigate(['/home']);
        }),
        catchError((err) => {
          console.log(err);
          this.toastService.initiate({
            title: 'Error',
            content: err.error.message,
          });
          return of(null);
        })
      )
      .subscribe();
  }

  logIn() {
    // Perform the login using the authentication service
    this.authService
      .logIn(this.loginForm.value)
      .pipe(
        switchMap((res) => {
          // Store the access token in local storage
          localStorage.setItem('token', res.token);
          // Redirect to the 'home' component
          return this.router.navigate(['/home']);
        }),
        catchError((err) => {
          console.log(err);
          this.toastService.initiate({
            title: 'Error',
            content: err.error.message,
          });
          return of(null);
        })
      )
      .subscribe();
  }
}
