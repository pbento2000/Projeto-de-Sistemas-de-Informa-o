import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { TokenService } from '../token.service';
import { PhotoService } from '../photo.service';
import { UserService } from '../user.service';

import { Photo } from '../photo';
import { User } from '../user';
import { Router } from '@angular/router';
import { AlertService } from '../alert';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  photoDetailsForm: FormGroup;
  photo?: Photo;
  @Input() fileName: string;
  @Input() photoDescription: string;
  user: User;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private router: Router,
    private photoService: PhotoService,
    private userService: UserService,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.photoDescription = "";
    this.photo = null;
    this.userService.getUserById(this.tokenService.getUser().id)
      .subscribe(
        user => this.user = user,
        error => {
          alert("Ocorreu um erro, por favor tente mais tarde");
        });
  }

  get f() { return this.photoDetailsForm.controls; }

  dropped(files: NgxFileDropEntry[]){
    console.log(files);
    if (files.length > 1){
      this.alertService.error('Escolha apenas uma imagem, companheiro', this.options);
    } 
    else{
      let droppedFile = files[0].fileEntry;
      if (droppedFile.isFile) {
        const fileEntry = droppedFile as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (file.type.match('image')){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            this.fileName = file.name;
            reader.onload = (event) => {
              var photoData = reader.result as string;
              this.photo = { photo: photoData, name: this.fileName } as Photo;
            }
            this.photoDetailsForm = this.formBuilder.group({
              name: [this.fileName, [Validators.required, Validators.maxLength(100)]],
              description: ['', [Validators.maxLength(500)]]
            });
          }
          else{
            this.alertService.error('Escolha uma imagem, companheiro', this.options);
          }
        });
      }
    }
  }

  checkDetails(formValues): void {
    var name = formValues["name"];
    var description = formValues["description"];

    if (description.trim().length == 0){
      if(confirm("Tem a certeza que quer submeter a foto sem descrição?")){
        this.postPhoto(this.photo, name, this.user);
      }
    } else {
      this.postPhoto(this.photo, name, this.user, description);
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
            this.router.navigate(['/home']);
        },
        error => {
          if(error.status == 409){
            alert("Não foi possivel submeter a sua foto");
          }
          else alert("Ocorreu um erro, por favor tente mais tarde");
        });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.photoDetailsForm.invalid) {
      return;
    }
    this.checkDetails(this.photoDetailsForm.value);
  }
}

