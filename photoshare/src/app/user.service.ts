import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user';
import { Observable } from 'rxjs';
import { Photo } from './photo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  
  getAll() {
    return this.http.get<User[]>(`http://localhost:3077/users`);
  }
  
  register(user: User) {
    return this.http.post(`http://localhost:3077/users/register`, user);
  }
  
  getUserById(id: any): Observable<User> {
    return this.http.get<User>('http://localhost:3077/users/' + id);
  }

  addFavorite(userID: string, photo: Photo): Observable<any> {
    return this.http.post(`http://localhost:3077/users/addFavorite/` + userID, photo);
  }

  removeFavorite(userID: string, photo: Photo): Observable<any> {
    return this.http.post(`http://localhost:3077/users/removeFavorite/` + userID, photo);
  }

  isFavorited(userID: string, photoID: string): Observable<boolean> {
    return this.http.get<boolean>('http://localhost:3077/users/' + userID + '/favorited/' + photoID);
  }

  isLiked(userID: string, photoID: string): Observable<boolean> {
    return this.http.get<boolean>('http://localhost:3077/users/' + userID + '/liked/' + photoID);
  }
  
  getFavoritePhotosIds(id: string):Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3077/users/favorites/' + id);
  }
}
