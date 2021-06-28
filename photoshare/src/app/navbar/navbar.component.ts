import { Component, OnInit } from '@angular/core';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { AlertService } from '../alert';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean;
  user: User;
  users: any;
  user2: string;
  userFound:boolean;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(private tokenService: TokenService, private router: Router, private userService: UserService, private alertService: AlertService) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();
    if (this.user) {
      console.log("loggen id");
      this.loggedIn = true;
    } else {
      console.log("loggen out");
      this.loggedIn = false;
    }
    this.clica();
  }

  mostraOpcoes(): void {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  logout(): void {
    this.tokenService.logout();
    this.loggedIn = false;
    this.router.navigate(['/home']);
  }

  clica(): void {
    window.onclick = function (event) {
      if (!(<HTMLTextAreaElement>event.target).matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i: number;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  }

  pesquisa(event): void {
    this.userService.getAll()
      .subscribe(users => {
        this.users = users;
        users.forEach(user => {
          if (user.username == event) {
            this.router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
              this.router.navigate([`profile/${user.username}`])
          });
            this.userFound = true;
          }
        }); 
        if (!this.userFound){
          /* this.options['id'] = 'alert-1';
          this.alertService.warn("User não encontrado :(", this.options); */
          alert('O user não foi encontrado :(');
        }
      });
  }

  onSubmit():void{
    console.log("ola");
    this.pesquisa(this.user2);
  }

  irPerfil():void{
    this.router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
      this.router.navigate([`profile/${this.user.username}`])
  });
  }
}



