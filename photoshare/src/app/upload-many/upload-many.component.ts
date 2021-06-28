import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, first } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { TokenService } from '../token.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { async } from '@angular/core/testing';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-upload-many',
  templateUrl: './upload-many.component.html',
  styleUrls: ['./upload-many.component.css']
})
export class UploadManyComponent implements OnInit {
  photos: Photo[];
  user: User;
  insertingDescriptions: boolean;
  currentPhoto: Photo;
  currentIndex: number;
  photoDescriptionForm: FormGroup;
  block: boolean;
  number: number;
  loading:boolean = false;

  constructor(
    private photoService: PhotoService, 
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.insertingDescriptions = false;
    this.photos = [];
    this.userService.getUserById(this.tokenService.getUser().id)
      .subscribe(
        user => this.user = user,
        error => {
          alert("Ocorreu um erro, por favor tente mais tarde");
        });

    this.photoDescriptionForm = this.formBuilder.group({
      description: [null, [Validators.maxLength(500)]]
    });
  }

  get f() { return this.photoDescriptionForm.controls; }

  folderChoosen(files: FileList): void {
    this.photos = [];
    this.insertingDescriptions = false;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.match('image')) {
          let reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = (event) => {
            var photoData = reader.result as string;
            this.photos.push({ photo: photoData, name: files[i].name } as Photo);
          }
        }
      }
    }
  }

  dropped(files: NgxFileDropEntry[]) {
    this.photos = [];
    this.insertingDescriptions = false;
    if (files.length > 0) {
      for (const droppedFile of files) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            if (file.type.match('image')) {
              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (event) => {
                var photoData = reader.result as string;
                this.photos.push({ photo: photoData, name: file.name } as Photo);
              }
            }
          });
        }
      }
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then();
  }

  startUpload(withDescriptions: boolean): void {
    this.number = 0;
    this.modalService.dismissAll();
    if (!withDescriptions) {
      this.loading=true;
      this.photos.forEach(photo => {
        this.postPhoto(photo, photo.name, this.user);
      });
    } else {
      this.insertingDescriptions = true;
      this.currentPhoto = this.photos[0];
      this.currentIndex = 0;
    }
  }

  postPhoto(photo: Photo, fileName: string, user: User, photoDescription: string = "") {
    this.photoService.upload({
      photo: photo.photo,
      name: fileName,
      description: photoDescription,
      likes: 0,
      owner: user
    }).pipe(first())
    .subscribe(
        photo => {
            this.number = this.number + 1;
            if(this.number == this.photos.length){
              this.router.navigate(['/home']);
            };
        },
        error => {
          if(error.status == 409){
            alert("Não foi possivel submeter a sua foto");
          }
          else alert("Ocorreu um erro, por favor tente mais tarde");
        });
  }

  skipPhoto(): void {
    this.photos[this.currentIndex].description = "";
    this.photoDescriptionForm.reset();
    this.block = this.currentIndex === this.photos.length - 1;
    if (!this.block) { 
      this.currentIndex += 1;
    } else {
      this.photoDescriptionForm.disable();
    }
  }

  onSubmit(): void{
    if (this.photoDescriptionForm.invalid) {return;}
    this.photos[this.currentIndex].description = this.photoDescriptionForm.value["description"];
    this.photoDescriptionForm.reset();
    this.block = this.currentIndex === this.photos.length - 1;
    if (!this.block) { 
      this.currentIndex += 1;
    } else {
      this.photoDescriptionForm.disable();
    }
  }

  uploadAll(): void{
    this.photos.forEach(photo => {
      this.postPhoto(photo, photo.name, this.user, photo.description);
    });
    setTimeout(() => {
      this.router.navigate(['/home']);
    },1000);
  }

  sortPhotosByName(photos: Photo[]): Photo[]{
    this.photos = photos.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
    return this.photos;
  }
}
