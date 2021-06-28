import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../authentication.service';
import { PasswordvalidatorService } from '../passwordvalidator.service';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), PasswordvalidatorService.numb_letters, PasswordvalidatorService.lowercase_special]],
      password: ['', [Validators.required, Validators.minLength(8), PasswordvalidatorService.lowercase, PasswordvalidatorService.uppercase, PasswordvalidatorService.strong]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.register(this.registerForm.value)
        .subscribe(
            data => {
                //this.router.navigate(['/login']);
                this.authenticationService.login(this.f.username.value, this.f.password.value)
                .subscribe(
                    data => {
                      this.tokenService.saveUser(data);
                      this.router.navigate(['/']);
                    },
                    error => {
                      alert("Erro ao dar login!")
                      this.loading = false;
                    });
            },
            error => {
              if(error.status == 409){
                alert("Username já existe, por favor escolha outro");
              }
              else alert("Ocorreu um erro, por favor tente mais tarde");
              this.loading = false;
            });
  }
}
