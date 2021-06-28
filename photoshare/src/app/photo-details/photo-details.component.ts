import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard'; 

import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { TokenService } from '../token.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { Alert, AlertService } from '../alert';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.css']
})
export class PhotoDetailsComponent implements OnInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false,

  };
  photo:Photo;
  user: any;
  userID:string;
  alreadyFavorited: boolean;
  alreadyLiked: boolean;
  totalLikes: number;
  cooldown: boolean;

  constructor(private route: ActivatedRoute, 
    private photoService: PhotoService,
    private userService: UserService,
    private tokenService: TokenService,
    private modalService: NgbModal,
    private router: Router,
    private clipboard: ClipboardService,
    private alertService: AlertService) {}

  ngOnInit() {
    let photoId = this.route.snapshot.paramMap.get('id');
    this.photoService.getPhotoById(photoId.toString()).subscribe(photo => {this.photo = photo;
      this.user=this.tokenService.getUser();
      if(this.user){
        this.userID = this.user.id;
      }
      this.totalLikes = photo.likes;
      this.userService.isFavorited(this.userID, photoId).subscribe(result => {this.alreadyFavorited = result});   
      this.userService.isLiked(this.userID, photoId).subscribe(result => {this.alreadyLiked = result}); 
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then();
  }

  deletePhoto(): void {
    this.modalService.dismissAll();
    this.photoService.deletePhoto(this.photo).subscribe(r => this.router.navigate(['/home']));
  }

  favorite(): void {
    this.cooldown = true;
    if (!this.alreadyFavorited) {
      this.userService.addFavorite(this.userID, this.photo).subscribe(r => {this.alreadyFavorited = true; this.cooldown = false;});
    } else {
      this.userService.removeFavorite(this.userID, this.photo).subscribe(r => {this.alreadyFavorited = false; this.cooldown = false;});
    }
  }

  like():void{
    this.cooldown = true;
    if(!this.alreadyLiked){
      this.photoService.addLike(this.photo, this.userID).subscribe(r => {this.alreadyLiked = true; this.totalLikes++; this.cooldown = false;});
    }else{
      this.photoService.removeLike(this.photo, this.userID).subscribe(r => {this.alreadyLiked = false; this.totalLikes--; this.cooldown = false;});
    }
  }

  share():void{
    let url = window.location.href;
    this.clipboard.copyFromContent(url);
    this.options['id'] = 'alert-2';
    this.alertService.info('O Url da foto foi copiado para o clipboard!', this.options);
  }
}