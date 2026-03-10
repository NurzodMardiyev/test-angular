import {Component, inject, OnInit} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {Divider} from 'primeng/divider';
import { jwtDecode } from 'jwt-decode';
import {AuthService} from '../../config/authentication/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    Avatar,
    Divider,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  constructor(private authService: AuthService) {}
  user: any;

  ngOnInit() {
    this.decodeToken();
  }

  decodeToken() {
    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        this.user = {
          name: decoded.name || decoded.sub,
          email: decoded.email,
          exp: decoded.exp
        };

        console.log(decoded);
      } catch (Error) {
        console.error('Tokenni decode qilishda xatolik:', Error);
      }
    }
  }
  onSignOut() {
    // this.authService.logout()
  }

}
