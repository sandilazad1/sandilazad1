import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from './models/user.model';
import { Logout } from './actions/auth.actions';
import { AuthState } from './state/auth.state';
import { Auth } from './models/auth.model';

@Injectable()
export class AuthService {
  @Select(AuthState.isLoggedIn) isLoggedIn: Observable<boolean>;
  @Select(AuthState.getAuthInfo) authInfo: Observable<Auth>;

  constructor(private store: Store, private http: HttpClient) {}

  authenticate(user: User): Observable<Auth> {
    return this.http.post<any>('http://localhost:3000/auth/login', user).pipe(
      map((response) =>
        response.isExecuted && response.data ? response.data : null
      ),
      catchError((error) => of(null))
    );
  }

  logout() {
    this.store.dispatch(new Logout());
    // this.router.navigate(["/auth"]);
  }
}
