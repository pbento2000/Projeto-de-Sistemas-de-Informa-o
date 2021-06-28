import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {  }

  login(username, password): Observable<any>{
      return this.http.post(`http://localhost:3077/users/authenticate`, { username, password });
  }

  register(user: User): Observable<any> {
    return this.http.post(`http://localhost:3077/users/register`, user);
  }
}
