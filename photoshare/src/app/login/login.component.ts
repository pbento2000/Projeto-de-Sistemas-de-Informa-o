import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { TokenService } from '../token.service';
import { PasswordvalidatorService } from '../passwordvalidator.service';
import { PhotoService } from '../photo.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  isLogged = false;
  failed = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private photoService: PhotoService,
  ) {  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), PasswordvalidatorService.lowercase_special, PasswordvalidatorService.numb_letters]],
      password: ['', Validators.required]
    });

    if(this.tokenService.getUser()){
      this.isLogged = true;
      this.router.navigate(['/']);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;

    // Se input for invalido nao continuar
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .subscribe(
            data => {
              this.tokenService.saveUser(data);
              this.isLogged = true;
              this.failed = false;
              setTimeout(() => {
                this.photoService.hasPhotos(data.id).subscribe(result => {if(result){this.router.navigate(['/profile/' + this.f.username.value]);}else{this.router.navigate(['/']);}})},5000);
            },
            error => {
              alert("Erro ao dar login!")
              this.loading = false;
            });
  }
}