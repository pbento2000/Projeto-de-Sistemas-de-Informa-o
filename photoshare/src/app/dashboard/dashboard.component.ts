import { Component, Injectable, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  photos2: Photo[] = [];
  isProfile: boolean;
  loading = true;
  pageType: string;
  loggedUser: User;
  user: string;
  isLoggedUser: boolean;

  ids: string[][];

  constructor(private photoService: PhotoService, private tokenService: TokenService, private route: Router, private userService: UserService) { }

  ngOnInit() {
    let p: any = window.performance.getEntriesByType("navigation")[0];
    if (String(p.type) === "back_forward") {
      location.reload();
    }

    this.loggedUser = this.tokenService.getUser();
    if(this.route.url == '/populares'){
      this.getPhotos('populares');
    }
    else if(this.route.url.split("/",2)[1] == 'profile'){
      this.user = this.route.url.split("/",3)[2];
      this.isLoggedUser = this.loggedUser && this.user == this.loggedUser.username;
      this.getPhotos('perfil', this.user);
    }
    else if(this.route.url.split("/",2)[1] == 'favoritos'){
      this.getFavoritePhotos();
    }
    else{
      this.getPhotos('recentes');
      
    }
  }

  private getPhotos(type: string, user: string = "") {
    this.photoService.getPhotoIds(type, user).subscribe(r => {
      let atLeastOne = r.length > 0;
      this.ids = this.splitIntoSubArray(r, 5);
      if (atLeastOne){
        from(this.ids)
          .pipe(concatMap(someIds => this.photoService.getPhotosByIds(someIds)))
          .subscribe(ps => { this.photos2 = this.photos2.concat(ps); this.loading = false; this.pageType = type; });
      } else {
        this.loading = false;
        this.pageType = type;
      }
    });
  }

  private splitIntoSubArray(arr, count): any[][] {
    var newArray = [];
    while (arr.length > 0) {
      newArray.push(arr.splice(0, count)); 
    }
    return newArray;
  }

  getFavoritePhotos() {
    this.userService.getFavoritePhotosIds(this.tokenService.getUser().id)
      .subscribe(
        r => {
          let atLeastOne = r['favorite_pics'].length > 0;
          if (atLeastOne) {
            let parsedIDs = r['favorite_pics'].map(id => ({ ['_id']: id }));
            this.ids = this.splitIntoSubArray(parsedIDs, 5);
            from(this.ids)
              .pipe(concatMap(someIds => this.photoService.getPhotosByIds(someIds)))
              .subscribe(ps => { this.photos2 = this.photos2.concat(ps); this.loading = false; this.pageType = 'favoritos'; });
          } else {
            this.loading = false;
            this.pageType = 'favoritos';
          }
        },
        error => {
          alert("Ocorreu um erro, por favor tente mais tarde");
        });
  }
}

