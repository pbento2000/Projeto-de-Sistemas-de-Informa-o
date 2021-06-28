import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Photo } from './photo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  
  constructor(private http: HttpClient) { }

  getPhotoById(photoId: string): Observable<Photo> {
    return this.http.get<Photo>('http://localhost:3077/photo/'+photoId);
  }
  
  upload(photo: Photo): Observable<Photo> {
    return this.http.post<Photo>(`http://localhost:3077/post_photo`, photo);
  }

  deletePhoto(photo: Photo): Observable<Photo>{
    return this.http.delete<Photo>('http://localhost:3077/photo/' + photo._id);
  }
  
  hasPhotos(id: string): Observable<boolean>{
    return this.http.get<boolean>('http://localhost:3077/hasPhotos/' + id);
  }

  addLike(photo: Photo, userID: string): Observable<any> {
    return this.http.post('http://localhost:3077/addLike/' + photo._id, {userid: userID});
  }

  removeLike(photo: Photo, userID: string): Observable<any> {
    return this.http.post('http://localhost:3077/removeLike/' + photo._id, {userid: userID});
  }

  getPhotoIds(type: string, user: string): Observable<string[]> {
    switch (type) {
      case 'recentes':
        return this.http.get<string[]>('http://localhost:3077/recent_photos_ids');
        break;
      case 'populares':
        return this.http.get<string[]>('http://localhost:3077/popular_photos_ids');
        break;
      case 'perfil':
        return this.http.get<string[]>('http://localhost:3077/profile_photos_ids/' + user);
        break;
      default:
        break;
    }
  }

  getPhotosByIds(ids: string[]): Observable<Photo[]> {
    return this.http.get<Photo[]>('http://localhost:3077/some_photos/' + JSON.stringify(ids));
  }
}
