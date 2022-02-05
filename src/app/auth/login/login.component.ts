import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { Login } from '../actions/auth.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  isLoggedIn: boolean;
  authSub: any;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    public snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((data) => {
      if (data) {
        this.router.navigate(['']);
      }
    });
  }

  loginForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    this.authSub = this.authService
      .authenticate(this.loginForm.value)
      .subscribe(
        (auth) => {
          if (auth && auth.isAuthenticated) {
            console.log(auth);

            this.isLoggedIn = true;
            this.store.dispatch(new Login(auth));
            this.router.navigate(['']);
          } else {
            this.loginForm.patchValue({
              userName: '',
              password: '',
            });
            this.snackBar.open(
              'Invalid username or password. Try again!',
              'x',
              {
                panelClass: ['error-snackbar'],
                verticalPosition: 'top',
                duration: 3000,
              }
            );
            this.isLoggedIn = false;

            return;
          }
        },
        (error) => {
          this.snackBar.open('Try again!', 'x', {
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      );
  }
}
