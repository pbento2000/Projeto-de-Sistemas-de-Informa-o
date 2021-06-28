import { Component, OnInit } from '@angular/core';

import { TokenService } from '../token.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedIn = false;
  user: User;

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();

    if(this.user){
      this.loggedIn = true;
    }
  }

  logout(): void {
    this.tokenService.logout();
    this.loggedIn = false;
    window.location.reload();
  }
}
